import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PlayerService } from 'src/player/player.service';
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private player: PlayerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: createUserDto.username,
        },
      });
      if (user) {
        throw new BadRequestException('Username is already taken!');
      }
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const createdUser = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: hash,
        },
      });
      await this.player.create({ userId: createdUser.id });
      delete createdUser.password;
      return createdUser;
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException(
        'Something went wrong while registering user!',
        500,
      );
    }
  }

  async login(loginDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: loginDto.username,
        },
      });
      if (!user) {
        throw new BadRequestException('User with given username not found!');
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new BadRequestException(
          'Password is incorrect! Please try again!',
        );
      }
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      if (e) {
        throw e;
      }
      throw new HttpException('Something went wrong while logging in!', 404);
    }
  }
}
