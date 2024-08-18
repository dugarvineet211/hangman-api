import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @UseGuards(AuthGuard)
  @Post()
  async makeGuess(@Body() body, @Request() req) {
    try {
      return await this.guessService.makeGuess(body.letter, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
