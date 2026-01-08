import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { TablesService } from '../tables/tables.service';
import { DatabaseService, Table, Player } from '../shared/database.service';
import { PlayActionDto, ActionType } from './dto/play-action.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class GameService {
  constructor(
    private cardsService: CardsService,
    private tablesService: TablesService,
    private databaseService: DatabaseService,
    private playersService: PlayersService,
  ) {}

  /**
   * Démarre une partie de poker
   */
  async startGame(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) throw new NotFoundException('Table non trouvée');
    if (table.players.length < 2) throw new BadRequestException('Il faut au moins 2 joueurs');
    if (table.status === 'playing') throw new BadRequestException('Déjà en cours');

    const deckId = `deck-${tableId}-${Date.now()}`;
    this.cardsService.createDeck(deckId);

    const updatedPlayers = table.players.map((player) => {
      const card1 = this.cardsService.drawCard(deckId);
      const card2 = this.cardsService.drawCard(deckId);
      return {
        ...player,
        cards: [card1.toString(), card2.toString()],
        currentBet: 0,
        hasFolded: false,
      };
    });

    // Blinds
    updatedPlayers[0].chips -= table.smallBlind;
    updatedPlayers[0].currentBet = table.smallBlind;
    updatedPlayers[1].chips -= table.bigBlind;
    updatedPlayers[1].currentBet = table.bigBlind;

    this.syncUserChips(updatedPlayers[0]);
    this.syncUserChips(updatedPlayers[1]);

    table.status = 'playing';
    table.players = updatedPlayers;
    table.pot = table.smallBlind + table.bigBlind;
    table.currentBet = table.bigBlind;
    table.currentPlayerIndex = updatedPlayers.length > 2 ? 2 : 0;
    (table as any).deckId = deckId;

    return { message: 'Partie démarrée', table };
  }

  async getGameState(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);
    if (!table) throw new NotFoundException('Table non trouvée');
    return table;
  }

  /**
   * Joue une action et gère le tour du bot automatiquement
   */
  async playAction(tableId: string, userId: string, playActionDto: PlayActionDto) {
    const table = await this.tablesService.getTableById(tableId);
    if (!table || table.status !== 'playing') throw new BadRequestException("Action impossible");

    const currentPlayer = table.players[table.currentPlayerIndex];
    if (currentPlayer.userId !== userId) throw new BadRequestException("Pas votre tour");

    // Traitement action humaine
    this.processLogic(table, currentPlayer, playActionDto);
    this.syncUserChips(currentPlayer);

    // Si après ton action le round n'est pas fini, on passe au bot
    if (!this.isRoundOver(table)) {
      table.currentPlayerIndex = this.getNextPlayer(table);
      
      const nextPlayer = table.players[table.currentPlayerIndex];
      if (nextPlayer && nextPlayer.isAI) {
        // On lance le tour du bot de manière asynchrone pour ne pas bloquer la réponse HTTP
        // Mais ici, pour simplifier la cohérence du retour, on peut l'attendre 
        await this.handleBotTurn(table);
      }
    } else {
      await this.endRound(table.id);
    }

    return { message: 'Action validée', table };
  }

  private processLogic(table: Table, player: Player, dto: PlayActionDto) {
  switch (dto.action) {
    case ActionType.FOLD:
      player.hasFolded = true;
      break;

    case ActionType.CALL:
      const diff = table.currentBet - player.currentBet;
      // On s'assure de ne pas avoir de jetons négatifs
      const actualDiff = Math.min(player.chips, diff); 
      player.chips -= actualDiff;
      player.currentBet += actualDiff;
      table.pot += actualDiff;
      break;

    case ActionType.RAISE:
      // On vérifie que amount existe. Sinon, on lance une erreur.
      if (dto.amount === undefined || dto.amount === null) {
        throw new BadRequestException("Le montant est requis pour une relance (Raise)");
      }

      const raiseAmount = dto.amount; // Ici, TypeScript sait que c'est un number
      const raiseDiff = raiseAmount - player.currentBet;

      if (player.chips < raiseDiff) {
        throw new BadRequestException("Vous n'avez pas assez de jetons");
      }

      player.chips -= raiseDiff;
      player.currentBet = raiseAmount;
      table.pot += raiseDiff;
      table.currentBet = raiseAmount;
      break;
  }
}

  private async handleBotTurn(table: Table) {
    // 1. Simulation de réflexion (2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bot = table.players[table.currentPlayerIndex];
    
    // 2. Le bot se couche
    bot.hasFolded = true;
    this.syncUserChips(bot);

    // 3. Vérification de fin de round après le fold
    if (this.isRoundOver(table)) {
      await this.endRound(table.id);
    } else {
      table.currentPlayerIndex = this.getNextPlayer(table);
    }
  }

  private syncUserChips(player: Player) {
    if (!player.isAI) {
      const user = this.databaseService.findUserById(player.userId);
      if (user) user.chips = player.chips;
    }
  }

  private getNextPlayer(table: Table): number {
    let next = (table.currentPlayerIndex + 1) % table.players.length;
    while (table.players[next].hasFolded) {
      next = (next + 1) % table.players.length;
    }
    return next;
  }

  private isRoundOver(table: Table): boolean {
    const active = table.players.filter(p => !p.hasFolded);
    if (active.length <= 1) return true;
    return active.every(p => p.currentBet === table.currentBet);
  }

  private async endRound(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);
    table.status = 'finished';

    const winners = table.players.filter(p => !p.hasFolded);
    const winner = winners[0] || table.players[0];

    winner.chips += table.pot;
    this.syncUserChips(winner);
    (table as any).lastWinner = winner.username;

    const deckId = (table as any).deckId;
    if (deckId) this.cardsService.deleteDeck(deckId);

    for (const player of table.players) {
      if (!player.isAI) {
        const isWinner = player.userId === winner.userId;
        await this.playersService.incrementStats(player.userId, isWinner);
      }
    }

    setTimeout(() => {
        this.tablesService.deleteTable(tableId); 
    }, 10000);
  }
}