import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoundModule } from 'src/round/round.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoundService } from 'src/round/round.service';

@Module({
  controllers: [GuessController],
  providers: [GuessService, PrismaService, RoundService],
  imports: [PrismaModule, RoundModule],
})
export class GuessModule {}
