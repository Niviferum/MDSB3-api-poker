import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Table } from './tables/entities/table.entity';
import { PlayerInGame } from './tables/entities/player-in-game.entity';
import { GameStats } from './tables/entities/game-stats.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'poker_db',
      entities: [User, Table, PlayerInGame, GameStats],
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ dev only
      logging: true,
    }),
    
    AuthModule,
    UsersModule,
    PlayersModule,
    TablesModule,
  ],
})
export class AppModule {}