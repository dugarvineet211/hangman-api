import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PlayerService, PrismaService],
  imports: [PrismaModule],
})
export class PlayerModule {}
