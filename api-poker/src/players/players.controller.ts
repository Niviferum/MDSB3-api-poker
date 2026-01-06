import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Players')
@Controller('players')

@ApiBearerAuth()
export class PlayersController {
  constructor(private playersService: PlayersService) {}
  
  @Get()
  @ApiOperation({ summary: 'Récupérer la liste de tous les joueurs' })
  @ApiResponse({ status: 200, description: 'Liste des joueurs' })
  async getAllPlayers() {
    return this.playersService.getAllPlayers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer les détails d\'un joueur' })
  @ApiResponse({ status: 200, description: 'Détails du joueur' })
  @ApiResponse({ status: 404, description: 'Joueur non trouvé' })
  async getPlayerById(@Param('id') id: string) {
    return this.playersService.getPlayerById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Récupérer les statistiques d\'un joueur' })
  @ApiResponse({ status: 200, description: 'Statistiques du joueur' })
  @ApiResponse({ status: 404, description: 'Joueur non trouvé' })
  async getPlayerStats(@Param('id') id: string) {
    return this.playersService.getPlayerStats(id);
  }
}
