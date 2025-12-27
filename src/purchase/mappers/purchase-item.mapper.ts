import { Injectable } from '@nestjs/common';
import { PurchaseItem } from '../entities/purchase-item.entity';
import { CreatePurchaseItemDto } from '../dto/create-purchase-item.dto';
import { UpdatePurchaseItemDto } from '../dto/update-purchase-item.dto';
import { PurchaseItemResponseDto } from '../dto/purchase-item-response.dto';

@Injectable()
export class PurchaseItemMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: PurchaseItem): PurchaseItemResponseDto {
    const dto = new PurchaseItemResponseDto();
    dto.id = entity.id;
    dto.purchaseId = entity.purchaseId;
    dto.productName = entity.product?.name ?? null;
    dto.productUnitId = entity.productUnitId;
    dto.productUnitName = entity.productUnit?.unitName ?? null;
    dto.quantity = entity.quantity;
    dto.price = entity.price;
    dto.subtotal = entity.subtotal;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: PurchaseItem[]): PurchaseItemResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(
    dto: CreatePurchaseItemDto,
    productId: string,
  ): Partial<PurchaseItem> {
    return {
      purchaseId: dto.purchaseId,
      productId: productId,
      productUnitId: dto.productUnitId,
      quantity: dto.quantity,
      price: dto.price,
      subtotal: dto.subtotal,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(
    dto: UpdatePurchaseItemDto,
    productId?: string,
  ): Partial<PurchaseItem> {
    const entity: Partial<PurchaseItem> = {};

    if (dto.purchaseId !== undefined) {
      entity.purchaseId = dto.purchaseId;
    }

    // If productUnitId is updated, use the provided productId (from productUnit)
    if (dto.productUnitId !== undefined && productId) {
      entity.productId = productId;
      entity.productUnitId = dto.productUnitId;
    }

    if (dto.quantity !== undefined) {
      entity.quantity = dto.quantity;
    }

    if (dto.price !== undefined) {
      entity.price = dto.price;
    }

    if (dto.subtotal !== undefined) {
      entity.subtotal = dto.subtotal;
    }

    return entity;
  }

  /**
   * Map Entity to Entity (for cloning or copying)
   */
  toEntity(entity: PurchaseItem): Partial<PurchaseItem> {
    return {
      purchaseId: entity.purchaseId,
      productId: entity.productId,
      productUnitId: entity.productUnitId,
      quantity: entity.quantity,
      price: entity.price,
      subtotal: entity.subtotal,
    };
  }
}

