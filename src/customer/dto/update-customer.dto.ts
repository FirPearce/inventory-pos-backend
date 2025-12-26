import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateCustomerDto) => o.name !== undefined)
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+6281234567890',
    type: String,
  })
  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'Phone must not exceed 50 characters' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: 'Jl. Sudirman No. 123, Jakarta',
    type: String,
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;
}

