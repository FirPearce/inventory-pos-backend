import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitName } from '../enums';

export class CreateProductUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'pcs',
    enum: UnitName,
  })
  @IsEnum(UnitName, { message: 'Unit name must be a valid enum value' })
  @IsNotEmpty({ message: 'Unit name is required' })
  unitName!: UnitName;

  @ApiPropertyOptional({
    description: 'Barcode',
    example: '1234567890123',
    type: String,
    maxLength: 255,
  })
  @IsString({ message: 'Barcode must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Barcode must not exceed 255 characters' })
  barcode?: string;

  @ApiProperty({
    description: 'Conversion to base unit',
    example: 1.0,
    type: Number,
  })
  @IsNumber({}, { message: 'Conversion to base must be a number' })
  @IsNotEmpty({ message: 'Conversion to base is required' })
  @Min(0.01, { message: 'Conversion to base must be greater than 0' })
  conversionToBase!: number;

  @ApiPropertyOptional({
    description: 'Is base unit',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean({ message: 'Is base unit must be a boolean' })
  @IsOptional()
  isBaseUnit?: boolean;
}
