import { Module } from '@nestjs/common';
import { HangmanGateway } from './hangman.gateway';

@Module({
  providers: [HangmanGateway],
  exports: [HangmanGateway],
})
export class HangmanGatewayModule {}
