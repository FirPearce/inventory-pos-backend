import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryNotFoundException } from '../exceptions/category-not-found.exception';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const entityData =
      this.categoryMapper.toEntityFromCreateDto(createCategoryDto);
    const category = this.categoryRepository.create(entityData);
    const savedCategory = await this.categoryRepository.save(category);
    return this.categoryMapper.toResponseDto(savedCategory);
  }

  async findAll(page: number = 1, limit: number = 10) {
    // Validate pagination parameters
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    const [entities, total] =
      await this.categoryRepository.findAllWithPagination(skip, limit);

    const data = this.categoryMapper.toResponseDtoList(entities);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid category ID is required');
    }

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    return this.categoryMapper.toResponseDto(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid category ID is required');
    }

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    // Map update DTO to entity data
    const updateData =
      this.categoryMapper.toEntityFromUpdateDto(updateCategoryDto);
    Object.assign(category, updateData);
    const updatedCategory = await this.categoryRepository.save(category);

    return this.categoryMapper.toResponseDto(updatedCategory);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid category ID is required');
    }

    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new CategoryNotFoundException(id);
    }

    await this.categoryRepository.softDelete(category);
  }
}
