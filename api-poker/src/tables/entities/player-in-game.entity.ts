import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Table } from './table.entity';

@Entity('players_in_game')
export class PlayerInGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  tableId: string;

  @Column()
  username: string;

  @Column({ default: false })
  isAI: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  chips: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBet: number;

  @Column({ default: false })
  folded: boolean;

  @Column('simple-array', { default: '' })
  cards: string[];

  @Column()
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.playersInGame, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Table, (table) => table.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tableId' })
  table: Table;
}