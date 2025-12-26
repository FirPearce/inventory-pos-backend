import { ApiProperty } from '@nestjs/swagger';
import { TransformDateToString } from '../../common/decorators/date-format.decorator';
import { PriceType } from '../enums';

export class ProductUnitPriceResponseDto {
  @ApiProperty({
    description: 'Product unit price ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product unit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  productUnitId: string;

  @ApiProperty({
    description: 'Price type',
    example: 'customer',
    enum: PriceType,
  })
  priceType: PriceType;

  @ApiProperty({
    description: 'Price amount',
    example: 10000.0,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Minimum quantity',
    example: 10.0,
    type: Number,
    nullable: true,
  })
  minimumQty: number;

  @ApiProperty({
    description: 'Is deleted',
    example: false,
    type: Boolean,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Start date in dd.mm.yyyy format',
    example: '01.01.2024',
    type: String,
    nullable: true,
  })
  @TransformDateToString()
  startDate: string | null;

  @ApiProperty({
    description: 'End date in dd.mm.yyyy format',
    example: '31.12.2024',
    type: String,
    nullable: true,
  })
  @TransformDateToString()
  endDate: string | null;
}
