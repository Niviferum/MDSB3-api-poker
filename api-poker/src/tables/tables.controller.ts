import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TablesService } from './tables.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTableDto } from './dto/dto';
import type { IJWTRequest } from 'src/auth/auth.interface';

@ApiTags('Tables')
@Controller('tables')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les tables disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des tables' })
  async getAllTables() {
    return this.tablesService.getAllTables();
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle table de poker' })
  @ApiResponse({ status: 201, description: 'Table créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async createTable(@Body() dto: CreateTableDto) {
    return this.tablesService.createTable(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer les détails d\'une table' })
  @ApiResponse({ status: 200, description: 'Détails de la table' })
  @ApiResponse({ status: 404, description: 'Table non trouvée' })
  async getTableById(@Param('id') id: string) {
    return this.tablesService.getTableById(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Rejoindre une table (IA se joint si joueur seul)' })
  @ApiResponse({ status: 200, description: 'Table rejointe' })
  @ApiResponse({ status: 400, description: 'Table pleine ou erreur' })
  @ApiResponse({ status: 404, description: 'Table non trouvée' })
  async joinTable(@Param('id') id: string, @Request() req : IJWTRequest) {
    return this.tablesService.joinTable(id, req.user.userId);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Quitter une table' })
  @ApiResponse({ status: 200, description: 'Table quittée' })
  @ApiResponse({ status: 404, description: 'Table non trouvée' })
  async leaveTable(@Param('id') id: string, @Request() req : IJWTRequest) {
    return this.tablesService.leaveTable(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une table' })
  @ApiResponse({ status: 200, description: 'Table supprimée' })
  @ApiResponse({ status: 404, description: 'Table non trouvée' })
  async deleteTable(@Param('id') id: string) {
    return this.tablesService.deleteTable(id);
  }
}