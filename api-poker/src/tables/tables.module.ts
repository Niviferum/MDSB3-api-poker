import { Module } from '@nestjs/common';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { DatabaseService } from '../shared/database.service';

@Module({
  controllers: [TablesController],
  providers: [TablesService, DatabaseService],
})
export class TablesModule {}