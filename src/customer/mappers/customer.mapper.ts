import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';

@Injectable()
export class CustomerMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.phone = entity.phone;
    dto.address = entity.address;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Customer[]): CustomerResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreateCustomerDto): Partial<Customer> {
    return {
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateCustomerDto): Partial<Customer> {
    const entity: Partial<Customer> = {};

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
  toEntity(entity: Customer): Partial<Customer> {
    return {
      name: entity.name,
      phone: entity.phone,
      address: entity.address,
    };
  }
}

