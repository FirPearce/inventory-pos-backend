import { Injectable } from '@nestjs/common';
import { Supplier } from '../entities/supplier.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';

@Injectable()
export class SupplierMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Supplier): SupplierResponseDto {
    const dto = new SupplierResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.phone = entity.phone;
    dto.address = entity.address;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Supplier[]): SupplierResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreateSupplierDto): Partial<Supplier> {
    return {
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateSupplierDto): Partial<Supplier> {
    const entity: Partial<Supplier> = {};

    if (dto.name !== undefined) {
      entity.name = dto.name;
    }

    if (dto.phone !== undefined) {
      entity.phone = dto.phone;
    }

    if (dto.address !== undefined) {
      entity.address = dto.address;
    }

    return entity;
  }

  /**
   * Map Entity to Entity (for cloning or copying)
   */
  toEntity(entity: Supplier): Partial<Supplier> {
    return {
      name: entity.name,
      phone: entity.phone,
      address: entity.address,
    };
  }
}
