import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'waiting' })
  status: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  pot: number;

  @Column({ default: 10 })
  smallBlind: number;

  @Column({ default: 20 })
  bigBlind: number;

  @Column({ default: 0 })
  dealerPosition: number;

  @Column({ default: 0 })
  currentPlayerIndex: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  currentBet: number;

  @Column('simple-array', { default: '' })
  communityCards: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('PlayerInGame', 'table', { cascade: true }) // ← String literal
  players: any[]; // ← Type any temporairement
}