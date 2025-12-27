import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePurchaseItemDto {
  @ApiProperty({
    description: 'Purchase ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'Purchase ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Purchase ID is required' })
  purchaseId!: string;

  @ApiProperty({
    description:
      'Product Unit ID (Product ID will be automatically derived from Product Unit)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'Product Unit ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Product Unit ID is required' })
  productUnitId!: string;

  @ApiProperty({
    description: 'Quantity',
    example: 10.0,
    type: Number,
    minimum: 0.01,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Quantity must be a number with max 2 decimal places' },
  )
  @IsNotEmpty({ message: 'Quantity is required' })
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  @Type(() => Number)
  quantity!: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 50000.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with max 2 decimal places' },
  )
  @IsNotEmpty({ message: 'Price is required' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Type(() => Number)
  price!: number;

  @ApiProperty({
    description: 'Subtotal (quantity * price)',
    example: 500000.0,
    type: Number,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Subtotal must be a number with max 2 decimal places' },
  )
  @IsNotEmpty({ message: 'Subtotal is required' })
  @Min(0, { message: 'Subtotal must be greater than or equal to 0' })
  @Type(() => Number)
  subtotal!: number;
}
