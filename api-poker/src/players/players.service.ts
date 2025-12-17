import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class PlayersService {
  constructor(private databaseService: DatabaseService) {}

  async getAllPlayers() {
    return this.databaseService.getUsers().map(({ password, ...user }) => user);
  }

  async getPlayerById(id: string) {
    const user = this.databaseService.findUserById(id);
    
    if (!user) {
      throw new NotFoundException('Joueur non trouvé');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPlayerStats(id: string) {
    const user = this.databaseService.findUserById(id);
    
    if (!user) {
      throw new NotFoundException('Joueur non trouvé');
    }

    return {
      userId: user.id,
      username: user.username,
      totalChips: user.chips,
      gamesPlayed: 0, // À implémenter avec la BDD
      gamesWon: 0,
      winRate: 0
    };
  }

  async updatePlayerChips(id: string, chips: number) {
    const user = this.databaseService.updateUserChips(id, chips);
    
    if (!user) {
      throw new NotFoundException('Joueur non trouvé');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}