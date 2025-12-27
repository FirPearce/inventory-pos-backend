import { IsString, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStockDto {
  @ApiPropertyOptional({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsString({ message: 'Product ID must be a string' })
  @IsOptional()
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId?: string;

  @ApiPropertyOptional({
    description: 'Product Unit ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  @IsString({ message: 'Product Unit ID must be a string' })
  @IsOptional()
  @IsUUID('4', { message: 'Product Unit ID must be a valid UUID' })
  productUnitId?: string;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 100.5,
    type: Number,
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsOptional()
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Minimum stock level',
    example: 10.0,
    type: Number,
  })
  @IsNumber({}, { message: 'Minimum stock must be a number' })
  @IsOptional()
  @Min(0, { message: 'Minimum stock must be greater than or equal to 0' })
  @Type(() => Number)
  minimumStock?: number;
}
