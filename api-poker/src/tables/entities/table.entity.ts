import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TableStatus } from '../../shared/enums/table-status.enum';
import { PlayerInGame } from './player-in-game.entity';

/**
 * Entite Table - Represente l'etat d'une table de poker
 * Gere le pot, les blinds, les cartes communes et le tour en cours
 */
@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Statut de la table
   * waiting: en attente de joueurs
   * playing: partie en cours
   * finished: partie terminee
   */
  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.WAITING,
  })
  status: TableStatus;

  /**
   * Pot actuel de la partie (somme des mises)
   * Type decimal pour precision exacte
   */
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  pot: string;

  @Column({ default: 10 })
  smallBlind: number;

  @Column({ default: 20 })
  bigBlind: number;

  /**
   * Position du bouton dealer (0-based index)
   * Tourne dans le sens horaire apres chaque main
   */
  @Column({ default: 0 })
  dealerPosition: number;

  /**
   * Index du joueur dont c'est le tour
   */
  @Column({ default: 0 })
  currentPlayerIndex: number;

  /**
   * Mise actuelle a suivre
   */
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBet: string;

  /**
   * Cartes communes (flop, turn, river)
   * Exemple: ['As', 'Kh', '10d']
   * Vide en pre-flop
   */
  @Column('simple-array', { default: '' })
  communityCards: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relation One-to-Many vers PlayerInGame
   * Une table peut avoir plusieurs joueurs
   * cascade: true = si on supprime la table, les PlayerInGame sont supprimes aussi
   */
  @OneToMany(() => PlayerInGame, (player) => player.table, { cascade: true })
  players: PlayerInGame[];
}
