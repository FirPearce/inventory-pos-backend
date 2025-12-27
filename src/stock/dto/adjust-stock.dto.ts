import { IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AdjustStockDto {
  @ApiProperty({
    description: 'Product Unit ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  @IsString({ message: 'Product Unit ID must be a string' })
  @IsNotEmpty({ message: 'Product Unit ID is required' })
  @IsUUID('4', { message: 'Product Unit ID must be a valid UUID' })
  productUnitId!: string;

  @ApiProperty({
    description:
      'Quantity adjustment (positive for increase, negative for decrease)',
    example: 10.5,
    type: Number,
  })
  @IsNumber({}, { message: 'Quantity adjustment must be a number' })
  @IsNotEmpty({ message: 'Quantity adjustment is required' })
  @Type(() => Number)
  quantityAdjustment!: number;
}
