import { Injectable } from '@nestjs/common';

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
  status: string;
  createdAt: Date;
}

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private tables: Table[] = [];

  // Users
  addUser(user: User) {
    this.users.push(user);
  }

  getUsers(): User[] {
    return this.users;
  }

  findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findUserByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  updateUserChips(id: string, chips: number): User | undefined {
    const user = this.findUserById(id);
    if (user) {
      user.chips = chips;
    }
    return user;
  }

  // Tables
  addTable(table: Table) {
    this.tables.push(table);
  }

  getTables(): Table[] {
    return this.tables;
  }

  findTableById(id: string): Table | undefined {
    return this.tables.find(t => t.id === id);
  }

  deleteTable(id: string): boolean {
    const index = this.tables.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tables.splice(index, 1);
      return true;
    }
    return false;
  }
}
