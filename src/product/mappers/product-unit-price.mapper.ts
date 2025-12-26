import { Injectable } from '@nestjs/common';
import { ProductUnitPrice } from '../entities/product_unit_price.entity';
import { CreateProductUnitPriceDto } from '../dto/create-product-unit-price.dto';
import { UpdateProductUnitPriceDto } from '../dto/update-product-unit-price.dto';
import { ProductUnitPriceResponseDto } from '../dto/product-unit-price-response.dto';
import { formatDateString } from '../../common/utils/date.util';

@Injectable()
export class ProductUnitPriceMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: ProductUnitPrice): ProductUnitPriceResponseDto {
    const dto = new ProductUnitPriceResponseDto();
    dto.id = entity.id;
    dto.productUnitId = entity.productUnitId;
    dto.priceType = entity.priceType;
    dto.price = entity.price;
    dto.minimumQty = entity.minimumQty;
    dto.isDeleted = entity.isDeleted;
    dto.startDate = formatDateString(entity.startDate);
    dto.endDate = formatDateString(entity.endDate);
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(
    entities: ProductUnitPrice[],
  ): ProductUnitPriceResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(
    dto: CreateProductUnitPriceDto,
    productUnitId: string,
  ): Partial<ProductUnitPrice> {
    return {
      productUnitId,
      priceType: dto.priceType,
      price: dto.price,
      minimumQty: dto.minimumQty,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(
    dto: UpdateProductUnitPriceDto,
  ): Partial<ProductUnitPrice> {
    const entity: Partial<ProductUnitPrice> = {};

    if (dto.priceType !== undefined) {
      entity.priceType = dto.priceType;
    }

    if (dto.price !== undefined) {
      entity.price = dto.price;
    }

    if (dto.minimumQty !== undefined) {
      entity.minimumQty = dto.minimumQty;
    }

    if (dto.startDate !== undefined) {
      entity.startDate = dto.startDate ?? null;
    }

    if (dto.endDate !== undefined) {
      entity.endDate = dto.endDate ?? null;
    }

    return entity;
  }
}
