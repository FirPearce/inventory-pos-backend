import {
  IsString,
  IsOptional,
  MaxLength,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UnitName } from '../enums';

export class UpdateProductUnitDto {
  @ApiPropertyOptional({
    description: 'Unit name',
    example: 'pcs',
    enum: UnitName,
  })
  @ValidateIf((o: UpdateProductUnitDto) => o.unitName !== undefined)
  @IsEnum(UnitName, { message: 'Unit name must be a valid enum value' })
  @IsOptional()
  unitName?: UnitName;

  @ApiPropertyOptional({
    description: 'Barcode',
    example: '1234567890123',
    type: String,
    maxLength: 255,
  })
  @ValidateIf((o: UpdateProductUnitDto) => o.barcode !== undefined)
  @IsString({ message: 'Barcode must be a string' })
  @MaxLength(255, { message: 'Barcode must not exceed 255 characters' })
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({
    description: 'Conversion to base unit',
    example: 1.0,
    type: Number,
  })
  @ValidateIf((o: UpdateProductUnitDto) => o.conversionToBase !== undefined)
  @IsNumber({}, { message: 'Conversion to base must be a number' })
  @Min(0.01, { message: 'Conversion to base must be greater than 0' })
  @IsOptional()
  conversionToBase?: number;

  @ApiPropertyOptional({
    description: 'Is base unit',
    example: false,
    type: Boolean,
  })
  @ValidateIf((o: UpdateProductUnitDto) => o.isBaseUnit !== undefined)
  @IsBoolean({ message: 'Is base unit must be a boolean' })
  @IsOptional()
  isBaseUnit?: boolean;
}
