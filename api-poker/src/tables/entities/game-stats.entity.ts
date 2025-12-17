import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { User } from '../../users/entities/user.entity';

@Entity('game_stats')
export class GameStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tableId: string;

  @Column()
  winnerId: string;

  @Column()
  winnerUsername: string;

  @Column('int')
  duration: number;

  @Column('decimal', { precision: 10, scale: 2 })
  finalPot: string;

  @CreateDateColumn()
  endedAt: Date;

  @ManyToOne(() => Table, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'tableId' })
  table: Table;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner: User;
}