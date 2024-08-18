import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { generateRandomWords } from 'src/helpers/generate-random-word';
import { PrismaService } from 'src/prisma/prisma.service';
import NO_OF_LIVES from 'src/constants/constants';

@Injectable()
export class RoundService {
  public static players = {};
  public static currentWord = '';
  constructor(private prisma: PrismaService) {}

  async startGame(roomHash, user) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          roomHash: roomHash,
        },
      });
      if (!room) {
        throw new BadRequestException('Room not found! Cannot start game!');
      }
      if (room.creatorId != user.sub) {
        throw new BadRequestException(
          'Sorry, only the room creator can start the game!',
        );
      }
      const availablePlayers = await this.prisma.player.findMany({
        where: {
          roomId: room.id,
        },
      });
      for (const obj of availablePlayers) {
        RoundService.players[obj.id] = obj;
      }
      await this.prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          isGameStarted: true,
        },
      });
      console.log(RoundService.players);
      return { message: 'Game started! Lets play the first round!' };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException(
        'Something went wrong while trying to join room!',
        404,
      );
    }
  }

  async endGame(roomHash, user) {
    const room = await this.prisma.room.findUnique({
      where: {
        roomHash: roomHash,
      },
    });
    if (!room) {
      throw new BadRequestException('Room not found! Cannot start game!');
    }
    if (room.creatorId != user.sub) {
      throw new BadRequestException(
        'Sorry, only the room creator can end the game!',
      );
    }
    await this.prisma.room.update({
      where: {
        id: room.id,
      },
      data: {
        isGameStarted: false,
      },
    });
    console.log(RoundService.players);
    return { message: 'Game Ended! Thank you for playing!' };
  }

  async startRound(roomHash, user, word?) {
    try {
      if (!word) {
        word = generateRandomWords();
      }
      const room = await this.prisma.room.findUnique({
        where: {
          roomHash: roomHash,
        },
      });
      if (room.creatorId != user.sub) {
        throw new BadRequestException('Room creator can only start the round!');
      }
      if (!room) {
        throw new BadRequestException('Room not found!');
      }
      if (!room.isGameStarted) {
        throw new BadRequestException('Game not started yet!');
      }
      if (word) {
        const data = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        );
        const wordData = data.data[0];
        if (!wordData) {
          throw new BadRequestException('Invalid word, please try again!');
        }
        RoundService.currentWord = word;
        return { hint: wordData.meanings[0].definitions[0].definition };
      }
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException(
        'Something went wrong while trying to join room!',
        404,
      );
    }
  }

  async endRound(roomHash, user) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          roomHash: roomHash,
        },
      });
      if (room.creatorId != user.sub) {
        throw new BadRequestException('Room creator can only start the round!');
      }
      if (!room) {
        throw new BadRequestException('Room not found!');
      }
      if (!room.isGameStarted) {
        throw new BadRequestException('Game not started yet!');
      }
      for (const playerId of Object.keys(RoundService.players)) {
        RoundService.players[playerId].lives = NO_OF_LIVES;
      }
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException(
        'Something went wrong while trying to join room!',
        404,
      );
    }
  }
}
