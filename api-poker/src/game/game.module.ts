import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { CardsModule } from '../cards/cards.module';
import { TablesModule } from '../tables/tables.module';
import { SharedModule } from '../shared/shared.module';
import { GameController } from './game.controller';
import { TablesService } from 'src/tables/tables.service';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [CardsModule, TablesModule, SharedModule, PlayersModule],
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}