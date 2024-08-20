import { forwardRef, Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';
import { RoomModule } from 'src/room/room.module';
import { HangmanGatewayModule } from 'src/gateway/gateway.module';

@Module({
  controllers: [RoundController],
  providers: [RoundService, PrismaService, RoomService],
  imports: [PrismaModule, forwardRef(() => RoomModule), HangmanGatewayModule],
})
export class RoundModule {}
