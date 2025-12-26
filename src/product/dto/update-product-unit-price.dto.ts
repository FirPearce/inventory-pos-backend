import { IsEnum, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PriceType } from '../enums';
import { TransformDateFromString } from '../../common/decorators/date-format.decorator';
import { IsDateString } from '../../common/validators/is-date-string.validator';

export class UpdateProductUnitPriceDto {
  @ApiPropertyOptional({
    description: 'Price type',
    example: 'customer',
    enum: PriceType,
  })
  @ValidateIf((o: UpdateProductUnitPriceDto) => o.priceType !== undefined)
  @IsEnum(PriceType, { message: 'Price type must be a valid enum value' })
  @IsOptional()
  priceType?: PriceType;

  @ApiPropertyOptional({
    description: 'Price amount',
    example: 10000.0,
    type: Number,
  })
  @ValidateIf((o: UpdateProductUnitPriceDto) => o.price !== undefined)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Minimum quantity',
    example: 10.0,
    type: Number,
  })
  @ValidateIf((o: UpdateProductUnitPriceDto) => o.minimumQty !== undefined)
  @IsNumber({}, { message: 'Minimum quantity must be a number' })
  @Min(0, { message: 'Minimum quantity must be greater than or equal to 0' })
  @IsOptional()
  minimumQty?: number;

  @ApiPropertyOptional({
    description: 'Start date in dd.mm.yyyy format',
    example: '01.01.2024',
    type: String,
  })
  @ValidateIf((o: UpdateProductUnitPriceDto) => o.startDate !== undefined)
  @TransformDateFromString()
  @IsDateString()
  @IsOptional()
  startDate?: Date | null;

  @ApiPropertyOptional({
    description: 'End date in dd.mm.yyyy format',
    example: '31.12.2024',
    type: String,
  })
  @ValidateIf((o: UpdateProductUnitPriceDto) => o.endDate !== undefined)
  @TransformDateFromString()
  @IsDateString()
  @IsOptional()
  endDate?: Date | null;
}
