import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoundService } from 'src/round/round.service';

@Injectable()
export class GuessService {
  constructor(private prisma: PrismaService) {}

  async makeGuess(letter, user) {
    try {
      if (!RoundService.players[user.sub].isRoundOver) {
        if (RoundService.currentRoundWord.includes(letter)) {
          for (let i = 0; i < RoundService.currentRoundWord.length; i++) {
            if (RoundService.currentRoundWord[i] == letter) {
              RoundService.players[user.sub].guessedWord = letter;
            }
          }
          if (!RoundService.players[user.sub].guessedWord.includes('_')) {
            RoundService.players[user.sub].score++;
            return {
              message: `You have done it! Correct guess! Your current score is ${RoundService.players[user.sub].score}`,
            };
          }
          return {
            message: 'Correct guess! Now guess another letter!',
            word: RoundService.players[user.sub].guessedWord
              .split('')
              .join(' '),
          };
        }
        RoundService.players[user.sub].lives--;
        if (RoundService.players[user.sub].lives == 0) {
          RoundService.players[user.sub].isRoundOver = true;
          return {
            message:
              'Oops! You are out of tries! Please wait for the next round to begin!',
          };
        }
        return {
          message: `Wrong guess! ${RoundService.players[user.sub].lives} tries left!`,
        };
      } else {
        return {
          message:
            'You have exhausted all your tries! Please wait for the next round to begin!',
        };
      }
    } catch (e) {
      throw new BadRequestException('Something went wrong! Please try again!');
    }
  }
}
