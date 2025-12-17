import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // ← Rend le module disponible partout sans import explicite
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class SharedModule {}
