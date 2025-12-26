import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Rokok',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateCategoryDto) => o.name !== undefined)
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Berbagai macam rokok',
    type: String,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
