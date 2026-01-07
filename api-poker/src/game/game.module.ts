import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { CardsModule } from '../cards/cards.module';
import { TablesModule } from '../tables/tables.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [CardsModule, TablesModule, SharedModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}