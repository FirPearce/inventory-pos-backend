import { Injectable } from '@nestjs/common';
import { Purchase } from '../entities/purchase.entity';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';

@Injectable()
export class PurchaseMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Purchase): PurchaseResponseDto {
    const dto = new PurchaseResponseDto();
    dto.id = entity.id;
    dto.supplierId = entity.supplierId;
    dto.supplierName = entity.supplier?.name ?? null;
    dto.invoiceNumber = entity.invoiceNumber;
    dto.totalAmount = entity.totalAmount;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Purchase[]): PurchaseResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreatePurchaseDto): Partial<Purchase> {
    return {
      supplierId: dto.supplierId,
      invoiceNumber: dto.invoiceNumber ?? null,
      totalAmount: dto.totalAmount,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdatePurchaseDto): Partial<Purchase> {
    const entity: Partial<Purchase> = {};

    if (dto.supplierId !== undefined) {
      entity.supplierId = dto.supplierId;
    }

    if (dto.invoiceNumber !== undefined) {
      entity.invoiceNumber = dto.invoiceNumber ?? null;
    }

    if (dto.totalAmount !== undefined) {
      entity.totalAmount = dto.totalAmount;
    }

    return entity;
  }

  /**
   * Map Entity to Entity (for cloning or copying)
   */
  toEntity(entity: Purchase): Partial<Purchase> {
    return {
      supplierId: entity.supplierId,
      invoiceNumber: entity.invoiceNumber,
      totalAmount: entity.totalAmount,
    };
  }
}
