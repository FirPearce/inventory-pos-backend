import { Injectable } from '@nestjs/common';
import { ProductUnit } from '../entities/product_unit.entity';
import { CreateProductUnitDto } from '../dto/create-product-unit.dto';
import { UpdateProductUnitDto } from '../dto/update-product-unit.dto';
import { ProductUnitResponseDto } from '../dto/product-unit-response.dto';

@Injectable()
export class ProductUnitMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: ProductUnit): ProductUnitResponseDto {
    const dto = new ProductUnitResponseDto();
    dto.id = entity.id;
    dto.productId = entity.productId;
    dto.unitName = entity.unitName;
    dto.barcode = entity.barcode;
    dto.conversionToBase = entity.conversionToBase;
    dto.isBaseUnit = entity.isBaseUnit;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: ProductUnit[]): ProductUnitResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(
    dto: CreateProductUnitDto,
    productId: string,
  ): Partial<ProductUnit> {
    return {
      productId,
      unitName: dto.unitName,
      barcode: dto.barcode,
      conversionToBase: dto.conversionToBase,
      isBaseUnit: dto.isBaseUnit ?? false,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateProductUnitDto): Partial<ProductUnit> {
    const entity: Partial<ProductUnit> = {};

    if (dto.unitName !== undefined) {
      entity.unitName = dto.unitName;
    }

    if (dto.barcode !== undefined) {
      entity.barcode = dto.barcode;
    }

    if (dto.conversionToBase !== undefined) {
      entity.conversionToBase = dto.conversionToBase;
    }

    if (dto.isBaseUnit !== undefined) {
      entity.isBaseUnit = dto.isBaseUnit;
    }

    return entity;
  }
}
