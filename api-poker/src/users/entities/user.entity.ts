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
 * Entite User - Represente un compte joueur
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
   * Le decorateur @Exclude empeche son exposition dans les reponses API
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * Cave du joueur en euros
   * Type decimal pour precision exacte (pas de float!)
   * Stocke en string pour eviter les erreurs d'arrondi JavaScript
   */
  @Column('decimal', { precision: 10, scale: 2, default: 1000 })
  bankroll: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Relation One-to-Many vers PlayerInGame
   * Un user peut participer a plusieurs parties
   */
  @OneToMany(() => PlayerInGame, (player) => player.user)
  playersInGame: PlayerInGame[];
}
