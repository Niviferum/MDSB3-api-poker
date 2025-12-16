import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PlayerInGame } from '../../tables/entities/player-in-game.entity';

/**
 * Chaque utilisateur recoit une cave de depart de 1000 euros
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  /**
   * Mot de passe hashe avec bcrypt
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * Cave du joueur en euros
   */
  @Column('decimal', { precision: 10, scale: 2, default: 1000 })
  bankroll: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relation One-to-Many vers PlayerInGame
   */
  @OneToMany(() => PlayerInGame, (player) => player.user)
  playersInGame: PlayerInGame[];
}
