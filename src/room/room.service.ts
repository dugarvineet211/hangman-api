import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomHash } from 'src/helpers/generate-room-hash';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
  static currentWord = '';
  async createRoom(createRoomDto: CreateRoomDto, user) {
    try {
      let roomHash;
      let existingRoom;
      const existingRoomCreatedByUser = await this.prisma.room.findUnique({
        where: {
          creatorId: user.sub,
        },
      });
      if (existingRoomCreatedByUser) {
        RoomService.currentWord = 'asd';
        delete existingRoomCreatedByUser.password;
        return {
          room: existingRoomCreatedByUser,
          message:
            'You have created a room already, please use it or delete and create a new one',
        };
      }
      do {
        roomHash = generateRandomHash();
        existingRoom = await this.prisma.room.findUnique({
          where: {
            roomHash: roomHash,
          },
        });
      } while (existingRoom);
      const password = createRoomDto.password
        ? await bcrypt.hash(createRoomDto.password, saltOrRounds)
        : null;
      const createdRoom = await this.prisma.room.create({
        data: {
          roomHash: roomHash,
          password: password,
          creatorId: user.sub,
        },
      });
      delete createdRoom.password;
      return {
        room: createdRoom,
        message:
          'Room successfully created! Invite your friends and play along!',
      };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException('Something went wrong while creating room!', 500);
    }
  }

  async removeRoom(id: number, user) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
      });
      if (!room) {
        throw new BadRequestException('Room with given id does not exist!');
      }
      if (user.sub != room.creatorId) {
        throw new BadRequestException('Sorry, you cannot delete this room!');
      }
      if (room.isGameStarted == true) {
        throw new BadRequestException(
          'Game is already in session! Cannot delete room now!',
        );
      }
      await this.prisma.room.delete({
        where: {
          id: id,
        },
      });
      return { success: true, message: 'Room deleted!' };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException('Something went wrong while deleting room!', 500);
    }
  }

  async joinRoom(joinRoomDto: JoinRoomDto, user) {
    try {
      const { password, roomHash } = joinRoomDto;
      const roomExists = await this.prisma.room.findUnique({
        where: {
          roomHash: roomHash,
        },
      });
      if (!roomExists) {
        throw new BadRequestException('Room with given code does not exist!');
      }
      if (roomExists.password) {
        const isMatch = await bcrypt.compare(password, roomExists.password);
        if (!isMatch) {
          throw new BadRequestException(
            'Password is incorrect! Please try again!',
          );
        }
      }
      if (roomExists.playerCount >= 8) {
        throw new BadRequestException('Player limit exceeded!');
      }
      await this.prisma.player.update({
        where: {
          id: user.sub,
        },
        data: {
          roomId: roomExists.id,
        },
      });
      await this.prisma.room.update({
        where: {
          id: roomExists.id,
        },
        data: {
          playerCount: roomExists.playerCount + 1,
        },
      });
      return { message: `Successfully joined ${roomExists.roomHash} room!` };
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
