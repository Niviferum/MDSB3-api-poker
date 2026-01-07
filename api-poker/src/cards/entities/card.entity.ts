export enum CardSuit {
  HEARTS = '♥',
  DIAMONDS = '♦',
  CLUBS = '♣',
  SPADES = '♠'
}

export enum CardRank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A'
}

export class Card {
  suit: CardSuit;
  rank: CardRank;
  value: number;

  constructor(suit: CardSuit, rank: CardRank) {
    this.suit = suit;
    this.rank = rank;
    this.value = this.getRankValue(rank);
  }

  private getRankValue(rank: CardRank): number {
    const values = {
      [CardRank.TWO]: 2,
      [CardRank.THREE]: 3,
      [CardRank.FOUR]: 4,
      [CardRank.FIVE]: 5,
      [CardRank.SIX]: 6,
      [CardRank.SEVEN]: 7,
      [CardRank.EIGHT]: 8,
      [CardRank.NINE]: 9,
      [CardRank.TEN]: 10,
      [CardRank.JACK]: 11,
      [CardRank.QUEEN]: 12,
      [CardRank.KING]: 13,
      [CardRank.ACE]: 14
    };
    return values[rank];
  }

  toString(): string {
    return `${this.rank}${this.suit}`;
  }

  toJSON() {
    return {
      suit: this.suit,
      rank: this.rank,
      value: this.value,
      display: this.toString()
    };
  }
}
