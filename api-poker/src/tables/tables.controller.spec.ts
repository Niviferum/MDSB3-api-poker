import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/dto';
import { Table } from '../shared/database.service';

describe('TablesController', () => {
  let controller: TablesController;
  let service: TablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: {
            createTable: jest.fn(),
            getAllTables: jest.fn(),
            getTableById: jest.fn(),
            joinTable: jest.fn(),
            leaveTable: jest.fn(),
            deleteTable: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TablesController>(TablesController);
    service = module.get<TablesService>(TablesService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('createTable', () => {
    it('devrait créer une table', async () => {
      const dto = {
        name: 'Table Test',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20,
      } as CreateTableDto;

      const mockTable: Table = {
        id: '1',
        name: dto.name,
        maxPlayers: dto.maxPlayers,
        smallBlind: dto.smallBlind,
        bigBlind: dto.bigBlind,
        players: [],
        pot: 0,
        communityCards: [],
        currentPlayerIndex: 0,
        status: 'waiting',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'createTable').mockResolvedValue(mockTable);

      const result = await controller.createTable(dto);

      expect(service.createTable).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTable);
      expect(result.name).toBe('Table Test');
      expect(result.status).toBe('waiting');
    });
  });

  describe('getAllTables', () => {
    it('devrait retourner toutes les tables', async () => {
      const mockTables: Table[] = [
        {
          id: '1',
          name: 'Table 1',
          maxPlayers: 6,
          smallBlind: 10,
          bigBlind: 20,
          players: [],
          pot: 0,
          communityCards: [],
          currentPlayerIndex: 0,
          status: 'waiting',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Table 2',
          maxPlayers: 10,
          smallBlind: 50,
          bigBlind: 100,
          players: [],
          pot: 0,
          communityCards: [],
          currentPlayerIndex: 0,
          status: 'ready',
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getAllTables').mockResolvedValue(mockTables);

      const result = await controller.getAllTables();

      expect(service.getAllTables).toHaveBeenCalled();
      expect(result).toEqual(mockTables);
      expect(result).toHaveLength(2);
    });
  });

  describe('getTableById', () => {
    it('devrait retourner une table spécifique', async () => {
      const mockTable: Table = {
        id: '1',
        name: 'Table VIP',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20,
        players: [],
        pot: 0,
        communityCards: [],
        currentPlayerIndex: 0,
        status: 'waiting',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'getTableById').mockResolvedValue(mockTable);

      const result = await controller.getTableById('1');

      expect(service.getTableById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTable);
    });
  });

  describe('joinTable', () => {
    it('devrait permettre à un joueur de rejoindre une table', async () => {
      const mockRequest = {
        user: { userId: 'user123', username: 'testuser' },
      };

      const mockTable: Table = {
        id: '1',
        name: 'Table Test',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20,
        players: [
          {
            userId: 'user123',
            username: 'testuser',
            chips: 1000,
            position: 0,
            cards: [],
            hasFolded: false,
            currentBet: 0,
          },
        ],
        pot: 0,
        communityCards: [],
        currentPlayerIndex: 0,
        status: 'ready',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'joinTable').mockResolvedValue(mockTable);

      const result = await controller.joinTable('1', mockRequest);

      expect(service.joinTable).toHaveBeenCalledWith('1', 'user123');
      expect(result.players).toHaveLength(1);
      expect(result.status).toBe('ready');
    });
  });

  describe('leaveTable', () => {
    it('devrait permettre à un joueur de quitter une table', async () => {
      const mockRequest = {
        user: { userId: 'user123', username: 'testuser' },
      };

      const mockTable: Table = {
        id: '1',
        name: 'Table Test',
        maxPlayers: 6,
        smallBlind: 10,
        bigBlind: 20,
        players: [],
        pot: 0,
        communityCards: [],
        currentPlayerIndex: 0,
        status: 'waiting',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'leaveTable').mockResolvedValue(mockTable);

      const result = await controller.leaveTable('1', mockRequest);

      expect(service.leaveTable).toHaveBeenCalledWith('1', 'user123');
      expect(result.players).toHaveLength(0);
    });
  });

  describe('deleteTable', () => {
    it('devrait supprimer une table', async () => {
      const mockResponse = {
        success: true,
        message: 'Table supprimée',
      };

      jest.spyOn(service, 'deleteTable').mockResolvedValue(mockResponse);

      const result = await controller.deleteTable('1');

      expect(service.deleteTable).toHaveBeenCalledWith('1');
      expect(result.success).toBe(true);
    });
  });
});