import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GameService } from './game.service';
import { PlayActionDto } from './dto/play-action.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// Interface pour typer la requête avec user JWT
interface AuthRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@ApiTags('Game')
@Controller('game')

@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('tables/:id/start')
  @ApiOperation({ summary: 'Démarrer une partie de poker' })
  @ApiResponse({
    status: 200,
    description: 'Partie démarrée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Pas assez de joueurs ou partie déjà en cours',
  })
  @ApiResponse({
    status: 404,
    description: 'Table non trouvée',
  })
  async startGame(@Param('id') tableId: string) {
    return this.gameService.startGame(tableId);
  }

  @Post('tables/:id/action')
  @ApiOperation({ summary: 'Jouer une action (fold, call, raise, check)' })
  @ApiResponse({
    status: 200,
    description: 'Action jouée avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Action invalide ou pas le tour du joueur',
  })
  @ApiResponse({
    status: 404,
    description: 'Table non trouvée',
  })
  async playAction(
    @Param('id') tableId: string,
    @Body() playActionDto: PlayActionDto,
    @Request() req: AuthRequest,
  ) {
    return this.gameService.playAction(tableId, req.user.userId, playActionDto);
  }

  @Get('tables/:id/state')
  @ApiOperation({ summary: 'Récupérer l\'état actuel de la partie' })
  @ApiResponse({
    status: 200,
    description: 'État de la partie récupéré',
  })
  @ApiResponse({
    status: 404,
    description: 'Table non trouvée',
  })
  async getGameState(@Param('id') tableId: string) {
    return this.gameService.getGameState(tableId);
  }
}