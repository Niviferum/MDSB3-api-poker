import { IsEnum, IsArray, ValidateNested, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CardSuit, CardRank } from '../entities/card.entity';

export class CreateCardDto {
  @ApiProperty({ enum: CardSuit, example: CardSuit.HEARTS })
  @IsEnum(CardSuit)
  suit: CardSuit;

  @ApiProperty({ enum: CardRank, example: CardRank.ACE })
  @IsEnum(CardRank)
  rank: CardRank;
}

export class CreateDeckDto {
  @ApiProperty({ 
    description: 'Mélanger automatiquement le paquet',
    default: true,
    required: false
  })
  @IsOptional()
  shuffle?: boolean;
}

export class DrawCardsDto {
  @ApiProperty({ 
    example: 5,
    description: 'Nombre de cartes à piocher',
    minimum: 1,
    maximum: 52
  })
  @IsInt()
  @Min(1)
  @Max(52)
  count: number;
}
