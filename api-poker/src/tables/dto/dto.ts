import { IsString, IsNumber, Min, Max, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ example: 'Table VIP' })
  @IsString()
  name: string;

  @ApiProperty({ example: 6, minimum: 2, maximum: 10 })
  @IsNumber()
  @Min(2)
  @Max(10)
  maxPlayers: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  smallBlind: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(1)
  bigBlind: number;

  @ValidateIf(o => o.bigBlind <= o.smallBlind)
  validate() {
    if (this.bigBlind <= this.smallBlind) {
      throw new Error('La grosse blinde doit être supérieure à la petite blinde');
    }
  }
}
