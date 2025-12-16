import { Module } from '@nestjs/common';
import { TableService } from './tables.service';

@Module({
  providers: [TableService],
  exports: [TableService],
})
export class TablesModule {}