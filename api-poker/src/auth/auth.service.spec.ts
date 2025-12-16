import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token')
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('devrait créer un utilisateur avec 1000€ de chips', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await service.register(dto);

      expect(result.success).toBe(true);
      expect(result.user.chips).toBe(1000);
      expect(result.user.username).toBe('testuser');
      expect(result.token).toBe('fake-jwt-token');
    });

    it('devrait lancer une erreur si l\'utilisateur existe déjà', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await service.register(dto);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur valide', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await service.register(registerDto);

      const loginDto = {
        username: 'testuser',
        password: 'password123'
      };

      const result = await service.login(loginDto);

      expect(result.success).toBe(true);
      expect(result.token).toBe('fake-jwt-token');
    });

    it('devrait lancer une erreur pour des identifiants invalides', async () => {
      const dto = {
        username: 'wronguser',
        password: 'wrongpassword'
      };

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
