import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Rokok',
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
    description: 'Category description',
    example: 'Berbagai macam rokok',
    type: String,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
