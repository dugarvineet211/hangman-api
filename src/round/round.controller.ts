import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  HttpException,
  Body,
} from '@nestjs/common';
import { RoundService } from './round.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { HangmanGateway } from 'src/gateway/hangman.gateway';

@Controller('round')
export class RoundController {
  constructor(
    private readonly roundService: RoundService,
    private readonly gateway: HangmanGateway,
  ) {}

  @UseGuards(AuthGuard)
  @Post('/start-game/:roomHash')
  async startGame(@Param() roomHash, @Request() req) {
    try {
      const res = await this.roundService.startGame(
        roomHash.roomHash,
        req.user,
      );
      this.gateway.server.to(roomHash.roomHash).emit('gameStarted', {
        message: 'Game has started!',
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/end-game/:roomHash')
  async endGame(@Param() roomHash, @Request() req) {
    try {
      const res = await this.roundService.endGame(roomHash.roomHash, req.user);
      this.gateway.server.to(roomHash.roomHash).emit('gameEnded', {
        message: 'Game has ended! Thank you for playing!',
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/start-round/:roomHash')
  async startRound(@Param() roomHash, @Request() req) {
    try {
      const res = await this.roundService.startRound(
        roomHash.roomHash,
        req.user,
      );
      this.gateway.server.to(roomHash.roomHash).emit('startedRound', {
        message: 'Round has started!',
      });
      this.gateway.server.to(roomHash.roomHash).emit('nextWordSetter', {
        message: `Next word master is ${res.nextWordMasterUsername}`,
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/generate-word/:roomHash')
  async generateWordForGame(@Param() roomHash, @Body() body, @Request() req) {
    try {
      return await this.roundService.generateWordForGame(
        roomHash.roomHash,
        req.user,
        body.word,
      );
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/end-current-round/:roomHash')
  async endRound(@Param() roomHash, @Body() body, @Request() req) {
    try {
      const res = await this.roundService.endRound(
        roomHash.roomHash,
        body.endGame,
        req.user,
      );
      this.gateway.server.to(roomHash.roomHash).emit('endedRound', {
        message: 'Round has ended!',
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
