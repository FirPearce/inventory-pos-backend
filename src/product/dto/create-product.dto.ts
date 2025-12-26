import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiPropertyOptional({
    description: 'Product SKU',
    example: 'PRD-001',
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'SKU must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'SKU must not exceed 255 characters' })
  sku?: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Rokok Sampoerna Mild',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name!: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId!: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Sampoerna',
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'Brand must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Brand must not exceed 255 characters' })
  brand?: string;
}
