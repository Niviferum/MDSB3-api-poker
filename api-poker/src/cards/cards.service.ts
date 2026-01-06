import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Card, CardSuit, CardRank } from './entities/card.entity';
import { CreateCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  private decks: Map<string, Card[]> = new Map();

  /**
   * Créer une carte unique
   */
  createCard(dto: CreateCardDto): Card {
    return new Card(dto.suit, dto.rank);
  }

  /**
   * Créer un paquet de 52 cartes standard
   */
  createDeck(deckId: string, shuffle: boolean = true): Card[] {
    const deck: Card[] = [];

    // Créer toutes les cartes
    Object.values(CardSuit).forEach(suit => {
      Object.values(CardRank).forEach(rank => {
        deck.push(new Card(suit, rank));
      });
    });

    if (shuffle) {
      this.shuffleDeck(deck);
    }

    this.decks.set(deckId, deck);
    return deck;
  }

  /**
   * Mélanger un paquet (algorithme Fisher-Yates)
   */
  shuffleDeck(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  /**
   * Récupérer un paquet par ID
   */
  getDeck(deckId: string): Card[] {
    const deck = this.decks.get(deckId);
    if (!deck) {
      throw new NotFoundException(`Paquet ${deckId} non trouvé`);
    }
    return deck;
  }

  /**
   * Piocher des cartes d'un paquet
   */
  drawCards(deckId: string, count: number): Card[] {
    const deck = this.getDeck(deckId);

    if (count < 1 || count > deck.length) {
      throw new BadRequestException(
        `Impossible de piocher ${count} cartes. Cartes disponibles: ${deck.length}`
      );
    }

    return deck.splice(0, count);
  }

  /**
   * Piocher une seule carte
   */
  drawCard(deckId: string): Card {
    return this.drawCards(deckId, 1)[0];
  }

  /**
   * Remettre des cartes dans le paquet
   */
  returnCards(deckId: string, cards: Card[]): void {
    const deck = this.getDeck(deckId);
    deck.push(...cards);
  }

  /**
   * Réinitialiser un paquet
   */
  resetDeck(deckId: string, shuffle: boolean = true): Card[] {
    return this.createDeck(deckId, shuffle);
  }

  /**
   * Supprimer un paquet
   */
  deleteDeck(deckId: string): void {
    if (!this.decks.has(deckId)) {
      throw new NotFoundException(`Paquet ${deckId} non trouvé`);
    }
    this.decks.delete(deckId);
  }

  /**
   * Récupérer tous les paquets
   */
  getAllDecks(): { deckId: string; cardsRemaining: number }[] {
    return Array.from(this.decks.entries()).map(([deckId, cards]) => ({
      deckId,
      cardsRemaining: cards.length
    }));
  }

  /**
   * Distribuer des cartes à plusieurs joueurs
   */
  dealToPlayers(deckId: string, playerCount: number, cardsPerPlayer: number): Card[][] {
    const totalCards = playerCount * cardsPerPlayer;
    const deck = this.getDeck(deckId);

    if (totalCards > deck.length) {
      throw new BadRequestException(
        `Pas assez de cartes. Nécessaire: ${totalCards}, Disponible: ${deck.length}`
      );
    }

    const hands: Card[][] = [];
    for (let i = 0; i < playerCount; i++) {
      hands.push(this.drawCards(deckId, cardsPerPlayer));
    }

    return hands;
  }

  /**
   * Créer des cartes communautaires (flop, turn, river)
   */
  dealCommunityCards(deckId: string, stage: 'flop' | 'turn' | 'river'): Card[] {
    const cardsToDraw = stage === 'flop' ? 3 : 1;
    
    // Brûler une carte avant de distribuer
    this.drawCard(deckId);
    
    return this.drawCards(deckId, cardsToDraw);
  }
}