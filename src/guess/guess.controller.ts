import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  Param,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { HangmanGateway } from 'src/gateway/hangman.gateway';

@Controller('guess')
export class GuessController {
  constructor(
    private readonly guessService: GuessService,
    private readonly gateway: HangmanGateway,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/:roomHash')
  async makeGuess(@Param() roomHash, @Body() body, @Request() req) {
    try {
      const res = await this.guessService.makeGuess(
        roomHash.roomHash,
        body.letter,
        req.user,
      );
      if (res && res.isLetterGuessed) {
        this.gateway.server.to(roomHash.roomHash).emit('letterGuessed', {
          message: `${req.user.username} has guessed ${res.word} correctly!`,
        });
      }

      if (res && res.isWordGuessed) {
        this.gateway.server.to(roomHash.roomHash).emit('wordGuessed', {
          message: `${req.user.username} guessed the word correctly! They have ${res.score} point now!`,
        });
      }

      if (res && res.isLetterMissed) {
        this.gateway.server.to(roomHash.roomHash).emit('letterMissed', {
          message: `${req.user.username} guessed incorrectly! They have ${res.tries} lives left!`,
        });
      }

      if (res && res.isTriesOver) {
        this.gateway.server.to(roomHash.roomHash).emit('isTriesOver', {
          message: `${req.user.username} has no lives left!`,
        });
      }
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
