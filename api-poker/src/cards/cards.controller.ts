import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateCardDto, CreateDeckDto, DrawCardsDto } from './dto/card.dto';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post('card')
  @ApiOperation({ summary: 'Créer une carte unique' })
  @ApiResponse({ status: 201, description: 'Carte créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  createCard(@Body() dto: CreateCardDto) {
    return this.cardsService.createCard(dto);
  }

  @Post('deck/:deckId')
  @ApiOperation({ summary: 'Créer un nouveau paquet de 52 cartes' })
  @ApiParam({ name: 'deckId', description: 'ID unique du paquet' })
  @ApiResponse({ status: 201, description: 'Paquet créé' })
  createDeck(
    @Param('deckId') deckId: string,
    @Body() dto: CreateDeckDto
  ) {
    const shuffle = dto.shuffle !== false;
    const deck = this.cardsService.createDeck(deckId, shuffle);
    return {
      deckId,
      cardsCount: deck.length,
      shuffled: shuffle,
      cards: deck
    };
  }

  @Get('deck/:deckId')
  @ApiOperation({ summary: 'Récupérer un paquet de cartes' })
  @ApiResponse({ status: 200, description: 'Paquet trouvé' })
  @ApiResponse({ status: 404, description: 'Paquet non trouvé' })
  getDeck(@Param('deckId') deckId: string) {
    const deck = this.cardsService.getDeck(deckId);
    return {
      deckId,
      cardsRemaining: deck.length,
      cards: deck
    };
  }

  @Post('deck/:deckId/draw')
  @ApiOperation({ summary: 'Piocher des cartes d\'un paquet' })
  @ApiResponse({ status: 200, description: 'Cartes piochées' })
  @ApiResponse({ status: 400, description: 'Impossible de piocher' })
  @ApiResponse({ status: 404, description: 'Paquet non trouvé' })
  drawCards(
    @Param('deckId') deckId: string,
    @Body() dto: DrawCardsDto
  ) {
    const cards = this.cardsService.drawCards(deckId, dto.count);
    const remainingCards = this.cardsService.getDeck(deckId).length;
    
    return {
      cards,
      drawn: cards.length,
      remaining: remainingCards
    };
  }

  @Post('deck/:deckId/shuffle')
  @ApiOperation({ summary: 'Mélanger un paquet existant' })
  @ApiResponse({ status: 200, description: 'Paquet mélangé' })
  @ApiResponse({ status: 404, description: 'Paquet non trouvé' })
  shuffleDeck(@Param('deckId') deckId: string) {
    const deck = this.cardsService.getDeck(deckId);
    this.cardsService.shuffleDeck(deck);
    
    return {
      deckId,
      message: 'Paquet mélangé',
      cardsCount: deck.length
    };
  }

  @Post('deck/:deckId/reset')
  @ApiOperation({ summary: 'Réinitialiser un paquet (52 cartes)' })
  @ApiResponse({ status: 200, description: 'Paquet réinitialisé' })
  resetDeck(
    @Param('deckId') deckId: string,
    @Query('shuffle') shuffle: string = 'true'
  ) {
    const shouldShuffle = shuffle !== 'false';
    const deck = this.cardsService.resetDeck(deckId, shouldShuffle);
    
    return {
      deckId,
      message: 'Paquet réinitialisé',
      cardsCount: deck.length,
      shuffled: shouldShuffle
    };
  }

  @Delete('deck/:deckId')
  @ApiOperation({ summary: 'Supprimer un paquet' })
  @ApiResponse({ status: 200, description: 'Paquet supprimé' })
  @ApiResponse({ status: 404, description: 'Paquet non trouvé' })
  deleteDeck(@Param('deckId') deckId: string) {
    this.cardsService.deleteDeck(deckId);
    return {
      success: true,
      message: `Paquet ${deckId} supprimé`
    };
  }

  @Get('decks')
  @ApiOperation({ summary: 'Lister tous les paquets actifs' })
  @ApiResponse({ status: 200, description: 'Liste des paquets' })
  getAllDecks() {
    return this.cardsService.getAllDecks();
  }

  @Post('deck/:deckId/deal')
  @ApiOperation({ summary: 'Distribuer des cartes aux joueurs' })
  @ApiResponse({ status: 200, description: 'Cartes distribuées' })
  @ApiQuery({ name: 'players', description: 'Nombre de joueurs' })
  @ApiQuery({ name: 'cardsPerPlayer', description: 'Cartes par joueur (défaut: 2)' })
  dealToPlayers(
    @Param('deckId') deckId: string,
    @Query('players') players: string,
    @Query('cardsPerPlayer') cardsPerPlayer: string = '2'
  ) {
    const playerCount = parseInt(players);
    const cardsCount = parseInt(cardsPerPlayer);

    const hands = this.cardsService.dealToPlayers(deckId, playerCount, cardsCount);
    const remainingCards = this.cardsService.getDeck(deckId).length;

    return {
      hands: hands.map((hand, index) => ({
        player: index + 1,
        cards: hand
      })),
      remaining: remainingCards
    };
  }

  @Post('deck/:deckId/community/:stage')
  @ApiOperation({ summary: 'Distribuer des cartes communautaires (flop/turn/river)' })
  @ApiParam({ name: 'stage', enum: ['flop', 'turn', 'river'] })
  @ApiResponse({ status: 200, description: 'Cartes communautaires distribuées' })
  dealCommunityCards(
    @Param('deckId') deckId: string,
    @Param('stage') stage: 'flop' | 'turn' | 'river'
  ) {
    const cards = this.cardsService.dealCommunityCards(deckId, stage);
    
    return {
      stage,
      cards,
      count: cards.length
    };
  }
}