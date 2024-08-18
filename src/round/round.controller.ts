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

@Controller('round')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @UseGuards(AuthGuard)
  @Post('/start-game/:roomHash')
  async startGame(@Param() roomHash, @Request() req) {
    try {
      return await this.roundService.startGame(roomHash.roomHash, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/end-game/:roomHash')
  async endGame(@Param() roomHash, @Request() req) {
    try {
      return await this.roundService.endGame(roomHash.roomHash, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/start-round/:roomHash')
  async startRound(@Param() roomHash, @Request() req, @Body() body?) {
    try {
      return await this.roundService.startRound(
        roomHash.roomHash,
        req.user,
        body?.word,
      );
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/start-round/:roomHash')
  async endRound(@Param() roomHash, @Request() req) {
    try {
      return await this.roundService.endRound(roomHash.roomHash, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
