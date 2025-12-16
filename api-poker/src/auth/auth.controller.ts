import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type {IJWTRequest} from "./auth.interface"
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte joueur avec 1000€ de cave' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 409, description: 'Utilisateur déjà existant' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les informations du joueur connecté' })
  @ApiResponse({ status: 200, description: 'Informations récupérées' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getProfile(@Request() req : IJWTRequest) {
    return this.authService.getUserById(req.user.userId);
  }
}