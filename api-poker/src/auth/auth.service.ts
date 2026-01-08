import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  async register(dto: RegisterDto) {
    // Vérifier si l'utilisateur existe
    const existingUser = 
      this.databaseService.findUserByEmail(dto.email) ||
      this.databaseService.findUserByUsername(dto.username);

    if (existingUser) {
      throw new ConflictException('Utilisateur déjà existant');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur avec 1000€ de cave
    const newUser = {
      id: Date.now().toString(),
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      chips: 1000,
      createdAt: new Date(),
      gamesPlayed: 0,
      gamesWon: 0
    };

    this.databaseService.addUser(newUser);

    // Générer le token JWT
    const token = this.generateToken(newUser.id);

    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      token,
      user: userWithoutPassword
    };
  }

  async login(dto: LoginDto) {
    // Trouver l'utilisateur
    const user = this.databaseService.findUserByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Générer le token JWT
    const token = this.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      token,
      userId: user.id,
      user: userWithoutPassword
    };
  }

  async getUserById(userId: string): Promise<any> {
    const user = this.databaseService.findUserById(userId);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(userId: string) {
    return this.databaseService.findUserById(userId);
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  // Pour les tests
  getAllUsers() {
    return this.databaseService.getUsers();
  }
}
