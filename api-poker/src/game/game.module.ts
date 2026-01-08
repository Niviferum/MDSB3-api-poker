import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { CardsModule } from '../cards/cards.module';
import { TablesModule } from '../tables/tables.module';
import { SharedModule } from '../shared/shared.module';
import { GameController } from './game.controller';

@Module({
  imports: [CardsModule, TablesModule, SharedModule],
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}