import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RoundController],
  providers: [RoundService, PrismaService],
  imports: [PrismaModule],
})
export class RoundModule {}
