import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';
import { RoundModule } from './round/round.module';
import { GuessModule } from './guess/guess.module';
import { HangmanGatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    UserModule,
    RoomModule,
    PlayerModule,
    RoundModule,
    GuessModule,
    HangmanGatewayModule,
  ],
})
export class AppModule {}
