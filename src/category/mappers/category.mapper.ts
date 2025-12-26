import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class CategoryMapper {
  /**
   * Map Entity to Response DTO
   */
  toResponseDto(entity: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }

  /**
   * Map multiple Entities to Response DTOs
   */
  toResponseDtoList(entities: Category[]): CategoryResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }

  /**
   * Map Create DTO to Entity (for new entity creation)
   */
  toEntityFromCreateDto(dto: CreateCategoryDto): Partial<Category> {
    return {
      name: dto.name,
      description: dto.description,
    };
  }

  /**
   * Map Update DTO to Entity (for partial updates)
   */
  toEntityFromUpdateDto(dto: UpdateCategoryDto): Partial<Category> {
    const entity: Partial<Category> = {};

    if (dto.name !== undefined) {
      entity.name = dto.name;
    }

    if (dto.description !== undefined) {
      entity.description = dto.description;
    }

    return entity;
  }

  /**
   * Map Entity to Entity (for cloning or copying)
   */
  toEntity(entity: Category): Partial<Category> {
    return {
      name: entity.name,
      description: entity.description,
    };
  }
}
