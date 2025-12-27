import { IsString, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsString({ message: 'Product ID must be a string' })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId!: string;

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
    description: 'Stock quantity',
    example: 100.5,
    type: Number,
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10.0,
    type: Number,
  })
  @IsNumber({}, { message: 'Minimum stock must be a number' })
  @IsNotEmpty({ message: 'Minimum stock is required' })
  @Min(0, { message: 'Minimum stock must be greater than or equal to 0' })
  @Type(() => Number)
  minimumStock!: number;
}
