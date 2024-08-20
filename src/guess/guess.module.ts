import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoundModule } from 'src/round/round.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoundService } from 'src/round/round.service';
import { RoomService } from 'src/room/room.service';
import { HangmanGatewayModule } from 'src/gateway/gateway.module';

@Module({
  controllers: [GuessController],
  providers: [GuessService, PrismaService, RoundService, RoomService],
  imports: [PrismaModule, RoundModule, HangmanGatewayModule],
})
export class GuessModule {}
