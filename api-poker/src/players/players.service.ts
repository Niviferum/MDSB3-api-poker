import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database.service';

@Injectable()
export class PlayersService {
  constructor(private databaseService: DatabaseService) {}

  async getAllPlayers() {
  return this.databaseService.getUsers().map((user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}

  async getPlayerById(id: string) {
    const user = this.databaseService.findUserById(id);
    
    if (!user) {
      throw new NotFoundException('Joueur non trouvé');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }


  async incrementStats(id: string, isWinner: boolean) {
    const user = this.databaseService.findUserById(id);
    if (!user) throw new NotFoundException('Joueur non trouvé');

    // Initialisation si les champs n'existent pas encore
    user.gamesPlayed = (user.gamesPlayed || 0) + 1;
    if (isWinner) {
      user.gamesWon = (user.gamesWon || 0) + 1;
    }

    return user;
  }

  async getPlayerStats(id: string) {
    const user = this.databaseService.findUserById(id);
    if (!user) throw new NotFoundException('Joueur non trouvé');

    const gamesPlayed = user.gamesPlayed || 0;
    const gamesWon = user.gamesWon || 0;
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;

    return {
      userId: user.id,
      username: user.username,
      totalChips: user.chips,
      gamesPlayed,
      gamesWon,
      winRate: Math.round(winRate) + '%'
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