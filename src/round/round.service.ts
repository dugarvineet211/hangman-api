import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { getNextUserId, generateRandomWords } from 'src/helpers/index';
import { PrismaService } from 'src/prisma/prisma.service';
import NO_OF_LIVES from 'src/constants/constants';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class RoundService {
  public static games = {};
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
  ) {}

  async startGame(roomHash, user) {
    try {
      const room = await this.roomService.getRoomByRoomHash(roomHash);
      if (room.creatorId != user.sub) {
        throw new BadRequestException(
          'Sorry, only the room creator can start the game!',
        );
      }
      if (room.playerCount < 2) {
        throw new BadRequestException(
          'Sorry, cannot start the game with just 1 player!',
        );
      }
      if (room.isGameStarted) {
        throw new BadRequestException('Game has already started!');
      }
      const availablePlayers = await this.prisma.player.findMany({
        where: {
          roomId: room.id,
        },
        include: {
          user: true,
        },
      });
      RoundService.games[roomHash] = {};
      RoundService.games[roomHash].playerIds = [];
      RoundService.games[roomHash].currentWordMasterId = null;
      RoundService.games[roomHash].currentWord = '';
      RoundService.games[roomHash].playerDetails = {};
      RoundService.games[roomHash].currentIndex = 0;
      RoundService.games[roomHash].isCurrentRoundStarted = false;
      for (const obj of availablePlayers) {
        RoundService.games[roomHash].playerDetails[obj.userId] = obj;
        RoundService.games[roomHash].playerDetails[obj.userId].guessedWord = '';
        RoundService.games[roomHash].playerIds.push(obj.userId);
      }
      await this.prisma.room.update({
        where: {
          roomHash: roomHash,
        },
        data: {
          isGameStarted: true,
        },
      });
      return { message: 'Game started! Lets play the first round!' };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new ServiceUnavailableException(
        'Something went wrong! Please try again',
      );
    }
  }

  async endGame(roomHash, user) {
    try {
      const room = await this.roomService.getRoomByRoomHash(roomHash);
      if (room.creatorId != user.sub) {
        throw new BadRequestException(
          'Sorry, only the room creator can end the game!',
        );
      }
      if (RoundService.games[roomHash]) {
        await this.prisma.player.updateMany({
          where: {
            id: {
              in: RoundService.games[roomHash].playerIds,
            },
          },
          data: {
            roomId: null,
          },
        });
        await this.prisma.room.update({
          where: {
            roomHash: roomHash,
          },
          data: {
            isGameStarted: false,
          },
        });
        delete RoundService.games[roomHash];
        return { message: 'Game Ended! Thank you for playing!' };
      }
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new ServiceUnavailableException(
        'Something went wrong! Please try again',
      );
    }
  }

  async startRound(roomHash, user) {
    try {
      const room = await this.roomService.getRoomByRoomHash(roomHash);
      if (room.creatorId != user.sub) {
        throw new BadRequestException('Room creator can only start the round!');
      }
      if (!room.isGameStarted) {
        throw new BadRequestException('Game not started yet!');
      }
      if (RoundService.games[roomHash].isCurrentRoundStarted) {
        throw new BadRequestException('Current round is already in progress!');
      }

      RoundService.games[roomHash].currentWordMasterId = getNextUserId(
        RoundService.games[roomHash].playerIds,
        RoundService.games[roomHash].currentIndex++,
      );
      const nextUser = await this.prisma.user.findUnique({
        where: {
          id: RoundService.games[roomHash].currentWordMasterId,
        },
        select: {
          username: true,
        },
      });
      RoundService.games[roomHash].isCurrentRoundStarted = true;
      return {
        message: 'Round started!',
        nextWordMaster: `Word master is ${nextUser.username}`,
        nextWordMasterUsername: nextUser.username,
      };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new ServiceUnavailableException(
        'Something went wrong! Please try again',
      );
    }
  }

  async endRound(roomHash, endGame = false, user) {
    try {
      const room = await this.roomService.getRoomByRoomHash(roomHash);
      if (endGame) {
        await this.endGame(roomHash, user);
        return {
          message: 'Game ended! Thank you for playing! See you again soon!',
        };
      }
      if (room.creatorId != user.sub) {
        throw new BadRequestException('Room creator can only end   the round!');
      }
      if (!room.isGameStarted) {
        throw new BadRequestException('Game not started yet!');
      }
      for (const userId of Object.keys(
        RoundService.games[roomHash].playerDetails,
      )) {
        RoundService.games[roomHash].playerDetails[userId].lives = NO_OF_LIVES;
        RoundService.games[roomHash].playerDetails[userId].isRoundOver = false;
      }
      RoundService.games[roomHash].currentWord = '';
      RoundService.games[roomHash].isCurrentRoundStarted = false;
      const data = await this.roomService.getRoomScores(roomHash);
      return {
        message: 'This round has ended! Want to play another one?',
        scores: data.scores,
      };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new ServiceUnavailableException(
        'Something went wrong! Please try again',
      );
    }
  }

  async generateWordForGame(roomHash, user, word?) {
    try {
      console.log(RoundService.games);
      if (
        RoundService.games[roomHash] &&
        RoundService.games[roomHash].currentWordMasterId != user.sub
      ) {
        throw new BadRequestException(
          'Sorry its not your turn to generate a word for this round!',
        );
      }
      if (!word) {
        word = generateRandomWords();
      }
      const data = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      const wordData = data.data[0];
      if (wordData || !wordData.meanings[0]) {
        throw new BadRequestException('Invalid word, please try again!');
      }
      RoundService.games[roomHash].currentWord = word;
      for (const userId of Object.keys(
        RoundService.games[roomHash].playerDetails,
      )) {
        RoundService.games[roomHash].playerDetails[userId].guessedWord = '_'
          .repeat(word.length)
          .split('');
      }
      return {
        hint: wordData.meanings[0].definitions[0].definition,
        length: word.length,
        word: word,
      };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new ServiceUnavailableException(
        'Something went wrong! Please try again',
      );
    }
  }
}
