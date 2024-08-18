import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomHash } from 'src/helpers/generate-room-hash';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}
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

  async removeRoom(id: number) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          id: id,
        },
      });
      if (!room) {
        throw new BadRequestException('Room with given id does not exist!');
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
}
