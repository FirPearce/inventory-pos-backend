import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceType } from '../enums';
import { TransformDateFromString } from '../../common/decorators/date-format.decorator';
import { IsDateString } from '../../common/validators/is-date-string.validator';

export class CreateProductUnitPriceDto {
  @ApiProperty({
    description: 'Price type',
    example: 'customer',
    enum: PriceType,
  })
  @IsEnum(PriceType, { message: 'Price type must be a valid enum value' })
  priceType!: PriceType;

  @ApiProperty({
    description: 'Price amount',
    example: 10000.0,
    type: Number,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price!: number;

  @ApiPropertyOptional({
    description: 'Minimum quantity',
    example: 10.0,
    type: Number,
  })
  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  @IsOptional()
  @Min(0, { message: 'Minimum quantity must be greater than or equal to 0' })
  minimumQty?: number;

  @ApiPropertyOptional({
    description: 'Start date in dd.mm.yyyy format',
    example: '01.01.2024',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @TransformDateFromString()
  startDate?: Date | null;

  @ApiPropertyOptional({
    description: 'End date in dd.mm.yyyy format',
    example: '31.12.2024',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  @TransformDateFromString()
  endDate?: Date | null;
}
