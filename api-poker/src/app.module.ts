import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { TablesModule } from './tables/tables.module';
import { DatabaseService } from './shared/database.service';

@Module({
  imports: [AuthModule, PlayersModule, TablesModule],
  providers: [DatabaseService],
})
export class AppModule {}
