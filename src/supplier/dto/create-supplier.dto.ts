import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Supplier phone number',
    example: '+6281234567890',
    type: String,
  })
  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'Phone must not exceed 50 characters' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Supplier address',
    example: 'Jl. Raya No. 123, Jakarta',
    type: String,
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;
}
