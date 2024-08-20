import { HttpException, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}
  async create(createPlayerDto: CreatePlayerDto) {
    try {
      return await this.prisma.player.create({
        data: {
          userId: createPlayerDto.userId,
          roomId: null,
        },
      });
    } catch (e) {
      throw new HttpException('Could not create player!', 400);
    }
  }
}
