import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

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
      return await this.roomService.joinRoom(joinRoomDto, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }
}
