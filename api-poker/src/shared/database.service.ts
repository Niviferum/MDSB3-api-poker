import { Injectable } from '@nestjs/common';

// ========== INTERFACES ==========
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  chips: number;
  createdAt: Date;
}

export interface Player {
  userId: string;
  username: string;
  chips: number;
  position: number;
  cards: string[];
  hasFolded: boolean;
  currentBet: number;
  isAI?: boolean;
}

export interface Table {
  id: string;
  name: string;
  maxPlayers: number;
  smallBlind: number;
  bigBlind: number;
  players: Player[];
  pot: number;
  communityCards: string[];
  currentPlayerIndex: number;
  status: 'waiting' | 'ready' | 'playing' | 'finished';
  createdAt: Date;
}


@Injectable()
export class DatabaseService {
  private users: any[] = [];
  private tables: any[] = [];

  // Users methods
  getUsers() {
    return this.users;
  }

  addUser(user: any) {
    this.users.push(user);
  }

  findUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  findUserByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  findUserByUsername(username: string) {
    return this.users.find(u => u.username === username);
  }

  updateUserChips(id: string, chips: number) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.chips = chips;
    }
    return user;
  }

  // Tables methods
  getTables() {
    return this.tables;
  }

  addTable(table: any) {
    this.tables.push(table);
  }

  findTableById(id: string) {
    return this.tables.find(t => t.id === id);
  }

  deleteTable(id: string) {
    const index = this.tables.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tables.splice(index, 1);
      return true;
    }
    return false;
  }
}