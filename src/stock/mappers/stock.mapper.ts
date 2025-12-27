import { Injectable } from '@nestjs/common';
import { Stock } from '../entities/stock.entity';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockResponseDto } from '../dto/stock-response.dto';

@Injectable()
export class StockMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Stock): StockResponseDto {
    const dto = new StockResponseDto();
    dto.id = entity.id;
    dto.productId = entity.productId;
    dto.productUnitId = entity.productUnitId;
    dto.quantity = Number(entity.quantity);
    dto.minimumStock = Number(entity.minimumStock);
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Stock[]): StockResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreateStockDto): Partial<Stock> {
    return {
      productId: dto.productId,
      productUnitId: dto.productUnitId,
      quantity: dto.quantity,
      minimumStock: dto.minimumStock,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateStockDto): Partial<Stock> {
    const entity: Partial<Stock> = {};

    if (dto.productId !== undefined) {
      entity.productId = dto.productId;
    }

    if (dto.productUnitId !== undefined) {
      entity.productUnitId = dto.productUnitId;
    }

    if (dto.quantity !== undefined) {
      entity.quantity = dto.quantity;
    }

    if (dto.minimumStock !== undefined) {
      entity.minimumStock = dto.minimumStock;
    }

    return entity;
  }
}
