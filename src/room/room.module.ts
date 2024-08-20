import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoundService } from 'src/round/round.service';
import { RoundModule } from 'src/round/round.module';
import { HangmanGatewayModule } from 'src/gateway/gateway.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, RoundService],
  imports: [PrismaModule, forwardRef(() => RoundModule), HangmanGatewayModule],
})
export class RoomModule {}
