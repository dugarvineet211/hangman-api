import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [UserModule, RoomModule, PlayerModule],
})
export class AppModule {}
