import {
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePurchaseItemDto {
  @ApiPropertyOptional({
    description: 'Purchase ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ValidateIf((o: UpdatePurchaseItemDto) => o.purchaseId !== undefined)
  @IsUUID('4', { message: 'Purchase ID must be a valid UUID' })
  @IsOptional()
  purchaseId?: string;

  @ApiPropertyOptional({
    description: 'Product Unit ID (Product ID will be automatically derived from Product Unit)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ValidateIf((o: UpdatePurchaseItemDto) => o.productUnitId !== undefined)
  @IsUUID('4', { message: 'Product Unit ID must be a valid UUID' })
  @IsOptional()
  productUnitId?: string;

  @ApiPropertyOptional({
    description: 'Quantity',
    example: 10.0,
    type: Number,
    minimum: 0.01,
  })
  @ValidateIf((o: UpdatePurchaseItemDto) => o.quantity !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Quantity must be a number with max 2 decimal places' })
  @Min(0.01, { message: 'Quantity must be greater than 0' })
  @IsOptional()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Price per unit',
    example: 50000.0,
    type: Number,
    minimum: 0,
  })
  @ValidateIf((o: UpdatePurchaseItemDto) => o.price !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with max 2 decimal places' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Subtotal (quantity * price)',
    example: 500000.0,
    type: Number,
    minimum: 0,
  })
  @ValidateIf((o: UpdatePurchaseItemDto) => o.subtotal !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Subtotal must be a number with max 2 decimal places' })
  @Min(0, { message: 'Subtotal must be greater than or equal to 0' })
  @IsOptional()
  @Type(() => Number)
  subtotal?: number;
}

