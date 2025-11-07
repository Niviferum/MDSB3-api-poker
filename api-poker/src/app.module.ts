import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Table } from './tables/entities/table.entity';
import { PlayerInGame } from './tables/entities/player-in-game.entity';

@Module({
  imports: [
    // Charge le .env et l'expose globalement
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Connexion TypeORM via Docker
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Table, PlayerInGame],
        synchronize: config.get<string>('NODE_ENV') !== 'production', // OK en dev
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    UsersModule,
  ],
})
export class AppModule {}
