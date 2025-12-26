import { ApiProperty } from '@nestjs/swagger';
import { UnitName } from '../enums';

export class ProductUnitResponseDto {
  @ApiProperty({
    description: 'Product unit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  productId: string;

  @ApiProperty({
    description: 'Unit name',
    example: 'pcs',
    enum: UnitName,
  })
  unitName: UnitName;

  @ApiProperty({
    description: 'Barcode',
    example: '1234567890123',
    type: String,
    nullable: true,
  })
  barcode: string;

  @ApiProperty({
    description: 'Conversion to base unit',
    example: 1.0,
    type: Number,
  })
  conversionToBase: number;

  @ApiProperty({
    description: 'Is base unit',
    example: false,
    type: Boolean,
  })
  isBaseUnit: boolean;
}
