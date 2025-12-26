import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

@Injectable()
export class ProductMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = entity.id;
    dto.sku = entity.sku;
    dto.name = entity.name;
    dto.categoryId = entity.categoryId;
    dto.brand = entity.brand;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Product[]): ProductResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreateProductDto): Partial<Product> {
    return {
      sku: dto.sku,
      name: dto.name,
      categoryId: dto.categoryId,
      brand: dto.brand,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateProductDto): Partial<Product> {
    const entity: Partial<Product> = {};

    if (dto.sku !== undefined) {
      entity.sku = dto.sku;
    }

    if (dto.name !== undefined) {
      entity.name = dto.name;
    }

    if (dto.categoryId !== undefined) {
      entity.categoryId = dto.categoryId;
    }

    if (dto.brand !== undefined) {
      entity.brand = dto.brand;
    }

    return entity;
  }

  /**
   * Map Entity to Entity (for cloning or copying)
   */
  toEntity(entity: Product): Partial<Product> {
    return {
      sku: entity.sku,
      name: entity.name,
      categoryId: entity.categoryId,
      brand: entity.brand,
    };
  }
}
