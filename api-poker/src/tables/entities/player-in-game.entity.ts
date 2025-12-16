import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Table } from './table.entity';

/**
 * Entite PlayerInGame - Represente un joueur a une table
 * Lie un User a une Table et stocke son etat dans la partie
 */
@Entity('players_in_game')
export class PlayerInGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Reference vers User
   */
  @Column({ nullable: true })
  userId: string;

  /**
   * Reference vers Table
   */
  @Column()
  tableId: string;

  /**
   * Nom d'affichage du joueur
   */
  @Column()
  username: string;

  /**
   * Indique si c'est une IA ou un vrai joueur
   */
  @Column({ default: false })
  isAI: boolean;

  /**
   * Jetons actuels du joueur a cette table
   * Decremente au fur et a mesure des mises
   */
  @Column('decimal', { precision: 10, scale: 2 })
  chips: string;

  /**
   * Mise actuelle du joueur dans le tour en cours
   */
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBet: string;

  /**
   * Indique si le joueur s'est couche
   */
  @Column({ default: false })
  folded: boolean;

  /**
   * Les 2 cartes privees du joueur
   */
  @Column('simple-array', { default: '' })
  cards: string[];

  /**
   * Position du joueur a la table (0, 1, 2...)
   */
  @Column()
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relation Many-to-One vers User
   * Plusieurs PlayerInGame peuvent reference le meme User
   * nullable: true car les IA n'ont pas de User associe
   */
  @ManyToOne(() => User, (user) => user.playersInGame, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Relation Many-to-One vers Table
   * Plusieurs PlayerInGame appartiennent a la meme Table
   * onDelete: CASCADE = si la table est supprimee, ce PlayerInGame aussi
   */
  @ManyToOne(() => Table, (table) => table.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tableId' })
  table: Table;
}
