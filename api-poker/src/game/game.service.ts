import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { TablesService } from '../tables/tables.service';
import { DatabaseService, Table, Player } from '../shared/database.service';

@Injectable()
export class GameService {
  constructor(
    private cardsService: CardsService,
    private tablesService: TablesService,
    private databaseService: DatabaseService,
  ) {}


    async startGame(tableId: string): Promise<Table> {
        throw new Error('Not implemented yet - Nael will implement this');
    }

  async playAction(
    tableId: string,
    userId: string,
    action: 'fold' | 'call' | 'raise' | 'check',
    amount?: number,
  ): Promise<Table> {
    throw new Error('Not implemented yet - Nael will implement this');
  }

  async getGameState(tableId: string): Promise<Table> {
    throw new Error('Not implemented yet - Nael will implement this');
  }

  // Méthodes privées (helpers)
  private getNextPlayer(table: Table): number {
    throw new Error('Not implemented yet - Nael will implement this');
  }

  private isRoundOver(table: Table): boolean {
    throw new Error('Not implemented yet - Nael will implement this');
  }

  private endRound(table: Table): Promise<Table> {
    throw new Error('Not implemented yet - Nael will implement this');
  }
}