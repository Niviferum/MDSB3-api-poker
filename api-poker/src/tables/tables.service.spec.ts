import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from './tables.service';
import { DatabaseService } from '../shared/database.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTableDto } from './dto/dto'; // Ajoutez cet import

describe('TablesService', () => {
  let service: TablesService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        DatabaseService, // Ajoutez le DatabaseService
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('createTable', () => {
    it('devrait créer une nouvelle table', async () => {
      const dto: CreateTableDto = { // Typez explicitement
        name: 'Table Test',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20
      };

      const result = await service.createTable(dto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Table Test');
      expect(result.players).toEqual([]);
      expect(result.status).toBe('waiting');
    });
  });

  describe('joinTable', () => {
    it('devrait ajouter une IA si le joueur est seul', async () => {
      const dto: CreateTableDto = { // Typez explicitement
        name: 'Table Test',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20
      };

      const table = await service.createTable(dto);
      
      // Mock d'un utilisateur via le DatabaseService
      (databaseService as any).users = [{
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed',
        chips: 1000,
        createdAt: new Date()
      }];

      const result = await service.joinTable(table.id, '1');

      expect(result.players.length).toBe(2); // Joueur + IA
      expect(result.players[1].isAI).toBe(true);
    });

    it('devrait lancer une erreur si la table est pleine', async () => {
      const dto: CreateTableDto = { // Typez explicitement
        name: 'Table Test',
        maxPlayers: 2,
        smallBlind: 10,
        bigBlind: 20
      };

      const table = await service.createTable(dto);
      
      // Remplir la table directement
      table.players = [
        { userId: '1', username: 'user1', chips: 1000, position: 0, cards: [], hasFolded: false, currentBet: 0 },
        { userId: '2', username: 'user2', chips: 1000, position: 1, cards: [], hasFolded: false, currentBet: 0 }
      ];

      await expect(service.joinTable(table.id, '3')).rejects.toThrow(BadRequestException);
    });
  });
});