import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePurchaseDto {
  @ApiPropertyOptional({
    description: 'Supplier ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ValidateIf((o: UpdatePurchaseDto) => o.supplierId !== undefined)
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({
    description: 'Invoice number',
    example: 'INV-2024-001',
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'Invoice number must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Invoice number must not exceed 255 characters' })
  invoiceNumber?: string | null;

  @ApiPropertyOptional({
    description: 'Total amount',
    example: 1000000.00,
    type: Number,
    minimum: 0,
  })
  @ValidateIf((o: UpdatePurchaseDto) => o.totalAmount !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total amount must be a number with max 2 decimal places' })
  @Min(0, { message: 'Total amount must be greater than or equal to 0' })
  @IsOptional()
  @Type(() => Number)
  totalAmount?: number;
}

