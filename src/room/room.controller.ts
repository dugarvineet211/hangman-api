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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    try {
      return await this.roomService.createRoom(createRoomDto, req.user);
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roomService.removeRoom(+id);
  }
}
