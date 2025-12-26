import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product SKU',
    example: 'PRD-001',
    type: String,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateProductDto) => o.sku !== undefined)
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(255, { message: 'SKU must not exceed 255 characters' })
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Rokok Sampoerna Mild',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateProductDto) => o.name !== undefined)
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @ValidateIf((o: UpdateProductDto) => o.categoryId !== undefined)
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'Sampoerna',
    type: String,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateProductDto) => o.brand !== undefined)
  @IsString({ message: 'Brand must be a string' })
  @MaxLength(255, { message: 'Brand must not exceed 255 characters' })
  @IsOptional()
  brand?: string;
}
