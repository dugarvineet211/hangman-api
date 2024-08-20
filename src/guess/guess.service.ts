import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoundService } from 'src/round/round.service';

@Injectable()
export class GuessService {
  constructor(private prisma: PrismaService) {}

  async makeGuess(roomHash, letter, user) {
    try {
      if (!RoundService.games[roomHash].playerDetails[user.sub]) {
        throw new BadRequestException('Sorry you are not a part of this room!');
      }
      if (RoundService.games[roomHash].currentWordMasterId == user.sub) {
        return {
          message:
            'Sorry as the current round WordMaster you cannot play this round!',
        };
      }
      if (!letter.length || letter.length > 1) {
        throw new BadRequestException('Please enter a valid single letter!');
      }
      if (!RoundService.games[roomHash].playerDetails[user.sub].isRoundOver) {
        if (RoundService.games[roomHash].currentWord.includes(letter)) {
          for (
            let i = 0;
            i < RoundService.games[roomHash].currentWord.length;
            i++
          ) {
            if (RoundService.games[roomHash].currentWord[i] == letter) {
              RoundService.games[roomHash].playerDetails[user.sub].guessedWord[
                i
              ] = letter;
            }
          }
          if (
            !RoundService.games[roomHash].playerDetails[
              user.sub
            ].guessedWord.includes('_')
          ) {
            RoundService.games[roomHash].playerDetails[user.sub].score++;
            return {
              message: `You have done it! Correct guess! Your current score is ${RoundService.games[roomHash].playerDetails[user.sub].score}`,
              score: RoundService.games[roomHash].playerDetails[user.sub].score,
              isWordGuessed: true,
            };
          }
          return {
            message: 'Correct guess! Now guess another letter!',
            word: RoundService.games[roomHash].playerDetails[
              user.sub
            ].guessedWord.join(' '),
            isLetterGuessed: true,
          };
        }
        RoundService.games[roomHash].playerDetails[user.sub].lives--;
        if (RoundService.games[roomHash].playerDetails[user.sub].lives == 0) {
          RoundService.games[roomHash].playerDetails[user.sub].isRoundOver =
            true;
          return {
            message:
              'Oops! You are out of tries! Please wait for the next round to begin!',
            isTriesOver: true,
          };
        }
        return {
          message: `Wrong guess! ${RoundService.games[roomHash].playerDetails[user.sub].lives} tries left!`,
          word: RoundService.games[roomHash].playerDetails[
            user.sub
          ].guessedWord.join(' '),
          isLetterMissed: true,
          tries: RoundService.games[roomHash].playerDetails[user.sub].lives,
        };
      } else {
        return {
          message:
            'The round is over for you! Please wait for the next round to begin!',
        };
      }
    } catch (e) {
      if (e) {
        throw e;
      }
      console.log(e);
      throw new BadRequestException('Something went wrong! Please try again!');
    }
  }
}
