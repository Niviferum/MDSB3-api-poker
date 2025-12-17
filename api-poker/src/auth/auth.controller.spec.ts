import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getUserById: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('devrait appeler authService.register', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      } as RegisterDto;

      const mockResult = {
        success: true,
        token: 'fake-token',
        user: { 
          id: '1', 
          username: 'testuser', 
          email: 'test@example.com', 
          chips: 1000,
          createdAt: new Date() // ← Ajout de cette propriété
        }
      };

      jest.spyOn(service, 'register').mockResolvedValue(mockResult as any);

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });
  });
});