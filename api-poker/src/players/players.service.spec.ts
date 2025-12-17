import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            getAllPlayers: jest.fn(),
            getPlayerById: jest.fn(),
            getPlayerStats: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPlayers', () => {
    it('devrait retourner la liste des joueurs', async () => {
      const mockPlayers = [{ id: '1', username: 'test', chips: 1000 }];
      jest.spyOn(service, 'getAllPlayers').mockResolvedValue(mockPlayers);

      const result = await controller.getAllPlayers();

      expect(service.getAllPlayers).toHaveBeenCalled();
      expect(result).toEqual(mockPlayers);
    });
  });
});