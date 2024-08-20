import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
  Get,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateRoomDto, JoinRoomDto } from './dto/index';
import { HangmanGateway } from 'src/gateway/hangman.gateway';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly gateway: HangmanGateway,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    try {
      return await this.roomService.createRoom(createRoomDto, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeRoom(@Param('id') id: string, @Request() req) {
    return await this.roomService.removeRoom(+id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post('/join-room')
  async joinRoom(@Body() joinRoomDto: JoinRoomDto, @Request() req) {
    try {
      const res = await this.roomService.joinRoom(joinRoomDto, req.user);
      this.gateway.server.to(joinRoomDto.roomHash).emit('joinRoom', {
        message: `User ${req.user.username} has joined the game!`,
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/get-room')
  async getRoomByCreatorId(@Request() req) {
    try {
      return await this.roomService.getRoomByCreatorId(req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/exit-room/:roomHash')
  async exitRoom(@Param() roomHash, @Request() req) {
    try {
      const res = await this.roomService.exitRoom(roomHash.roomHash, req.user);
      this.gateway.server.to(roomHash.roomHash).emit('leaveRoom', {
        message: `User ${req.user.username} has left the game!`,
      });
      return res;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/get-scores/:roomHash')
  async getRoomScores(@Param() roomHash) {
    try {
      return await this.roomService.getRoomScores(roomHash.roomHash);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
