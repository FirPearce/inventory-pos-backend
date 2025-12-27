import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Supplier ID is required' })
  supplierId!: string;

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

  @ApiProperty({
    description: 'Total amount',
    example: 1000000.00,
    type: Number,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total amount must be a number with max 2 decimal places' })
  @IsNotEmpty({ message: 'Total amount is required' })
  @Min(0, { message: 'Total amount must be greater than or equal to 0' })
  @Type(() => Number)
  totalAmount!: number;
}

