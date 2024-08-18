import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, PlayerService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
    PlayerModule,
  ],
})
export class UserModule {}
