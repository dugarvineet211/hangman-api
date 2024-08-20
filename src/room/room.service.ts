import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomHash } from 'src/helpers/index';
import * as bcrypt from 'bcrypt';
import { RoundService } from 'src/round/round.service';
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
      if (roomExists.isGameStarted) {
        throw new BadRequestException('Sorry game has already started!');
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

  async getRoomByCreatorId(user) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          creatorId: user.sub,
        },
      });
      if (!room) {
        return {
          message:
            'Sorry! No rooms created by you! Please create one and try again!',
        };
      }
      return room;
    } catch (e) {
      throw new ServiceUnavailableException('Something went wrong!');
    }
  }

  async getRoomByRoomHash(roomHash) {
    try {
      const room = await this.prisma.room.findUnique({
        where: {
          roomHash: roomHash,
        },
      });
      if (!room) {
        throw new BadRequestException('Room not found! Cannot start game!');
      }
      return room;
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async exitRoom(roomHash, user) {
    try {
      const room = await this.getRoomByRoomHash(roomHash);
      if (
        RoundService.games &&
        RoundService.games[roomHash] &&
        RoundService.games[roomHash].playerDetails
      ) {
        RoundService.games[roomHash].playerIds = RoundService.games[
          roomHash
        ].playerIds.filter((el) => el !== user.sub);
        delete RoundService.games[roomHash].playerDetails[user.sub];
      }
      await this.prisma.player.update({
        where: {
          userId: user.sub,
        },
        data: {
          roomId: null,
        },
      });
      await this.prisma.room.update({
        where: {
          roomHash: roomHash,
        },
        data: {
          playerCount: room.playerCount - 1,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async getRoomScores(roomHash) {
    try {
      if (
        RoundService.games &&
        RoundService.games[roomHash] &&
        RoundService.games[roomHash].playerDetails
      ) {
        const scores = [];
        for (const key of Object.keys(
          RoundService.games[roomHash].playerDetails,
        )) {
          const score = RoundService.games[roomHash].playerDetails[key].score;
          const username =
            RoundService.games[roomHash].playerDetails[key].user.username;
          scores.push({ username: username, score: score });
        }
        return { scores: scores };
      } else {
        return { message: 'Game not started yet! No scores to show!' };
      }
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
