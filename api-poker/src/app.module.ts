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
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'poker_db',
      entities: [User, Table, PlayerInGame, GameStats],
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ dev only
      logging: true,
    }),
    
    SharedModule,
    AuthModule,
    UsersModule,
    PlayersModule,
    TablesModule,
  ],
})
export class AppModule {}