import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export enum ActionType {
  FOLD = 'fold',
  CALL = 'call',
  RAISE = 'raise',
  CHECK = 'check',
}

export class PlayActionDto {
  @ApiProperty({
    description: 'Type d\'action à effectuer',
    enum: ActionType,
    example: ActionType.CALL,
  })
  @IsNotEmpty()
  @IsEnum(ActionType)
  action: ActionType;

  @ApiProperty({
    description: 'Montant à miser (obligatoire pour RAISE)',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;
}