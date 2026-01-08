import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTableDto } from './dto/dto';
import { DatabaseService, Table, Player } from '../shared/database.service';

@Injectable()
export class TablesService {
  constructor(private databaseService: DatabaseService) {}

  async createTable(dto: CreateTableDto): Promise<Table> {
    // Validation manuelle des blinds
    if (dto.bigBlind <= dto.smallBlind) {
      throw new BadRequestException('La grosse blinde doit être supérieure à la petite blinde');
    }

    const newTable: Table = {
      id: Date.now().toString(),
      name: dto.name,
      maxPlayers: dto.maxPlayers,
      smallBlind: dto.smallBlind,
      bigBlind: dto.bigBlind,
      players: [],
      pot: 0,
      communityCards: [],
      currentPlayerIndex: 0,
      currentBet: 0,
      status: 'waiting',
      createdAt: new Date(),
      
    };

    this.databaseService.addTable(newTable);
    return newTable;
  }

  async getAllTables(): Promise<Table[]> {
    return this.databaseService.getTables();
  }

  async getTableById(id: string): Promise<Table> {
    const table = this.databaseService.findTableById(id);
    
    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    return table;
  }

  async joinTable(tableId: string, userId: string): Promise<Table> {
    const table = this.databaseService.findTableById(tableId);
    
    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    if (table.players.length >= table.maxPlayers) {
      throw new BadRequestException('Table pleine');
    }

    if (table.players.some((p: Player) => p.userId === userId)) {
      throw new BadRequestException('Vous êtes déjà à cette table');
    }

    const user = this.databaseService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.chips < table.bigBlind) {
      throw new BadRequestException('Pas assez de jetons pour rejoindre cette table');
    }

    const player: Player = {
      userId: user.id,
      username: user.username,
      chips: user.chips,
      position: table.players.length,
      cards: [],
      hasFolded: false,
      currentBet: 0
    };

    table.players.push(player);

    // Si le joueur est seul, ajouter une IA
    if (table.players.length === 1) {
      const aiPlayer: Player = {
        userId: 'ai-' + Date.now(),
        username: 'Bot_' + Math.random().toString(36).substring(7),
        chips: 1000,
        position: 1,
        cards: [],
        hasFolded: false,
        currentBet: 0,
        isAI: true
      };
      table.players.push(aiPlayer);
    }

    if (table.players.length >= 2 && table.status === 'waiting') {
      table.status = 'ready';
    }

    return table;
  }

  async leaveTable(tableId: string, userId: string): Promise<Table> {
    const table = this.databaseService.findTableById(tableId);
    
    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    const playerIndex = table.players.findIndex((p: Player) => p.userId === userId);
    
    if (playerIndex === -1) {
      throw new BadRequestException('Vous n\'êtes pas à cette table');
    }

    // Retirer le joueur
    table.players.splice(playerIndex, 1);

    // Réorganiser les positions
    table.players.forEach((player: Player, index: number) => {
      player.position = index;
    });

    if (table.players.length < 2) {
      table.status = 'waiting';
    }

    return table;
  }

  async deleteTable(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = this.databaseService.deleteTable(id);
    
    if (!deleted) {
      throw new NotFoundException('Table non trouvée');
    }

    return { success: true, message: 'Table supprimée' };
  }
}