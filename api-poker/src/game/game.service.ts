import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { TablesService } from '../tables/tables.service';
import { DatabaseService, Table, Player } from '../shared/database.service';
import { PlayActionDto, ActionType } from './dto/play-action.dto';

@Injectable()
export class GameService {
  constructor(
    private cardsService: CardsService,
    private tablesService: TablesService,
    private databaseService: DatabaseService,
  ) {}

  /**
   * Démarre une partie de poker
   */
  async startGame(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    // Vérifier qu'il y a au moins 2 joueurs
    if (table.players.length < 2) {
      throw new BadRequestException(
        'Il faut au moins 2 joueurs pour démarrer une partie',
      );
    }

    // Vérifier que la table n'est pas déjà en jeu
    if (table.status === 'playing') {
      throw new BadRequestException('La partie est déjà en cours');
    }

    // Créer un deck de cartes pour la table avec un ID unique
    const deckId = `deck-${tableId}-${Date.now()}`;
    this.cardsService.createDeck(deckId);


const updatedPlayers = table.players.map((player) => {
  const card1 = this.cardsService.drawCard(deckId);
  const card2 = this.cardsService.drawCard(deckId);

  return {
    ...player,
    cards: [card1.toString(), card2.toString()], // Convertir Card en string
    currentBet: 0,
    hasFolded: false,
  };
});

    // Placer la petite blind (joueur 0)
    const smallBlindAmount = table.smallBlind;
    updatedPlayers[0].currentBet = smallBlindAmount;
    updatedPlayers[0].chips -= smallBlindAmount;

    // Placer la grosse blind (joueur 1)
    const bigBlindAmount = table.bigBlind;
    updatedPlayers[1].currentBet = bigBlindAmount;
    updatedPlayers[1].chips -= bigBlindAmount;

    // Calculer le pot initial (somme des blindes)
    const initialPot = smallBlindAmount + bigBlindAmount;

    // Le premier joueur à parler est après la grosse blind (joueur 2, ou joueur 0 si seulement 2 joueurs)
    const firstPlayerIndex = updatedPlayers.length > 2 ? 2 : 0;

    // Mettre à jour la table DIRECTEMENT (modification en mémoire)
    table.status = 'playing';
    table.players = updatedPlayers;
    table.pot = initialPot;
    table.currentBet = bigBlindAmount;
    table.currentPlayerIndex = firstPlayerIndex;
    table.communityCards = [];
    (table as any).deckId = deckId; // Stocker le deckId pour pouvoir l'utiliser plus tard

    // Mettre à jour les chips en base (seulement pour les vrais joueurs, pas les IA)
    if (!updatedPlayers[0].isAI) {
      const user0 = this.databaseService.findUserById(updatedPlayers[0].userId);
      if (user0) {
        user0.chips = updatedPlayers[0].chips;
      }
    }
    if (!updatedPlayers[1].isAI) {
      const user1 = this.databaseService.findUserById(updatedPlayers[1].userId);
      if (user1) {
        user1.chips = updatedPlayers[1].chips;
      }
    }

    return {
      message: 'Partie démarrée avec succès',
      table: {
        id: table.id,
        status: table.status,
        pot: table.pot,
        currentBet: table.currentBet,
        currentPlayer: table.currentPlayerIndex,
        deckId: deckId,
        players: table.players.map((p) => ({
          userId: p.userId,
          username: p.username,
          chips: p.chips,
          currentBet: p.currentBet,
          cards: p.cards,
        })),
      },
    };
  }

  /**
   * Joue une action (fold, call, raise, check)
   */
  async playAction(
    tableId: string,
    userId: string,
    playActionDto: PlayActionDto,
  ) {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    if (table.status !== 'playing') {
      throw new BadRequestException('La partie n\'est pas en cours');
    }

    // Vérifier que c'est bien le tour du joueur
    const currentPlayer = table.players[table.currentPlayerIndex];
    if (currentPlayer.userId !== userId) {
      throw new BadRequestException('Ce n\'est pas votre tour de jouer');
    }

    const { action, amount } = playActionDto;

    // Traiter l'action selon le type
    switch (action) {
      case ActionType.FOLD:
        // Marquer le joueur comme ayant fold
        table.players[table.currentPlayerIndex].hasFolded = true;
        break;

      case ActionType.CALL:
        // Calculer le montant à suivre
        const amountToCall = table.currentBet - currentPlayer.currentBet;

        if (currentPlayer.chips < amountToCall) {
          throw new BadRequestException('Chips insuffisants pour call');
        }

        // Débiter les chips et ajouter au pot
        table.players[table.currentPlayerIndex].chips -= amountToCall;
        table.players[table.currentPlayerIndex].currentBet += amountToCall;
        table.pot += amountToCall;
        break;

      case ActionType.RAISE:
        if (!amount || amount <= 0) {
          throw new BadRequestException(
            'Le montant du raise doit être supérieur à 0',
          );
        }

        // Le raise doit être au moins égal au double de la mise actuelle
        const minRaise = table.currentBet * 2;
        if (amount < minRaise) {
          throw new BadRequestException(
            `Le raise minimum est de ${minRaise} chips`,
          );
        }

        // Calculer le montant total à débiter
        const amountToRaise = amount - currentPlayer.currentBet;

        if (currentPlayer.chips < amountToRaise) {
          throw new BadRequestException('Chips insuffisants pour raise');
        }

        // Débiter les chips, mettre à jour la mise et le pot
        table.players[table.currentPlayerIndex].chips -= amountToRaise;
        table.players[table.currentPlayerIndex].currentBet = amount;
        table.pot += amountToRaise;
        table.currentBet = amount;
        break;

      case ActionType.CHECK:
        // Vérifier que le check est autorisé (pas de mise à suivre)
        if (currentPlayer.currentBet < table.currentBet) {
          throw new BadRequestException(
            'Impossible de checker, vous devez call ou raise',
          );
        }
        // Le check ne change rien, on passe juste au joueur suivant
        break;

      default:
        throw new BadRequestException('Action invalide');
    }

    // Mettre à jour les chips en base pour le joueur actuel (sauf si c'est une IA)
    if (!currentPlayer.isAI) {
      const user = this.databaseService.findUserById(currentPlayer.userId);
      if (user) {
        user.chips = table.players[table.currentPlayerIndex].chips;
      }
    }

    // Passer au joueur suivant
    const nextPlayerIndex = this.getNextPlayer(table);

    // Vérifier si le round est terminé
    const roundOver = this.isRoundOver(table);

    if (roundOver) {
      // Terminer le round
      const result = await this.endRound(tableId);

      return {
        message: 'Round terminé',
        action: action,
        roundOver: true,
        ...result,
      };
    }

    // Mettre à jour le joueur actif
    table.currentPlayerIndex = nextPlayerIndex;

    return {
      message: 'Action jouée avec succès',
      action: action,
      roundOver: false,
      nextPlayer: table.players[nextPlayerIndex].username,
      pot: table.pot,
      currentBet: table.currentBet,
    };
  }

  /**
   * Récupère l'état actuel de la partie
   */
  async getGameState(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    return {
      id: table.id,
      name: table.name,
      status: table.status,
      maxPlayers: table.maxPlayers,
      smallBlind: table.smallBlind,
      bigBlind: table.bigBlind,
      pot: table.pot,
      currentBet: table.currentBet,
      currentPlayer: table.currentPlayerIndex,
      communityCards: table.communityCards || [],
      players: table.players.map((p) => ({
        userId: p.userId,
        username: p.username,
        chips: p.chips,
        currentBet: p.currentBet,
        hasFolded: p.hasFolded,
        cards: p.cards,
      })),
    };
  }

  // ============================================
  // MÉTHODES PRIVÉES (HELPERS)
  // ============================================

  /**
   * Trouve le prochain joueur actif (qui n'a pas fold)
   */
  private getNextPlayer(table: Table): number {
    const players = table.players;
    let nextPlayerIndex = (table.currentPlayerIndex + 1) % players.length;
    let attempts = 0;

    // Boucle pour trouver le prochain joueur actif
    while (attempts < players.length) {
      const player = players[nextPlayerIndex];
      
      // Si le joueur n'a pas fold, c'est lui le prochain
      if (!player.hasFolded) {
        return nextPlayerIndex;
      }

      nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
      attempts++;
    }

    // Si on arrive ici, il n'y a plus de joueur actif (ne devrait pas arriver)
    return -1;
  }

  /**
   * Vérifie si le tour de mises est terminé
   */
  private isRoundOver(table: Table): boolean {
    const players = table.players;
    
    // Compte les joueurs actifs (qui n'ont pas fold)
    const activePlayers = players.filter((p) => !p.hasFolded);

    // Si un seul joueur actif, le round est terminé
    if (activePlayers.length <= 1) {
      return true;
    }

    // Vérifie si tous les joueurs actifs ont misé le même montant
    const currentBet = table.currentBet || 0;
    const allPlayersBetEqual = activePlayers.every(
      (p) => p.currentBet === currentBet,
    );

    return allPlayersBetEqual;
  }

  /**
   * Termine le round : détermine le gagnant et distribue le pot
   */
  private async endRound(tableId: string): Promise<any> {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) {
      throw new NotFoundException('Table non trouvée');
    }

    // Trouve le(s) gagnant(s) (version simple : dernier joueur actif)
    const activePlayers = table.players.filter((p) => !p.hasFolded);

    if (activePlayers.length === 0) {
      throw new BadRequestException('Aucun joueur actif');
    }

    // Pour l'instant : le gagnant est le dernier joueur actif
    const winner = activePlayers[0];

    // Sauvegarder le pot avant de le réinitialiser
    const winAmount = table.pot;

    // Crédite le pot au gagnant
    const newChips = winner.chips + table.pot;

    // Met à jour les chips en base (seulement si ce n'est pas une IA)
    if (!winner.isAI) {
      const user = this.databaseService.findUserById(winner.userId);
      if (user) {
        user.chips = newChips;
      }
    }

    // Supprimer le deck utilisé pour cette partie
    const deckId = (table as any).deckId;
    if (deckId) {
      try {
        this.cardsService.deleteDeck(deckId);
      } catch (error) {
        // Ignorer si le deck n'existe pas
      }
    }

    // Réinitialise la table DIRECTEMENT
    table.status = 'waiting';
    table.pot = 0;
    table.currentBet = 0;
    table.currentPlayerIndex = 0;
    table.players = table.players.map((p) => ({
      ...p,
      cards: [],
      currentBet: 0,
      hasFolded: false,
      chips: p.userId === winner.userId ? newChips : p.chips,
    }));
    table.communityCards = [];
    delete (table as any).deckId; // Supprimer le deckId

    return {
      winner: {
        userId: winner.userId,
        username: winner.username,
        winAmount: winAmount,
      },
      finalPot: winAmount,
    };
  }
}