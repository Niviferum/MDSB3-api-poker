import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { TablesModule } from './tables/tables.module';
import { DatabaseService } from './shared/database.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PlayersModule, TablesModule, CatsController],
  providers: [DatabaseService, CatsService],
})
export class AppModule {}
