import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { DatabaseService } from '../shared/database.service';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService, DatabaseService],
})
export class PlayersModule {}