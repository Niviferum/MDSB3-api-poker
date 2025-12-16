import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator'; // ← AJOUTER cet import

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // ← AJOUTER cette ligne
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  // @UseGuards(AuthGuard) ← RETIRER cette ligne (le guard est déjà global)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest & { user: any }) {
    return req.user;
  }
}