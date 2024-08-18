import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';
import { RoundModule } from './round/round.module';

@Module({
  imports: [UserModule, RoomModule, PlayerModule, RoundModule],
})
export class AppModule {}
