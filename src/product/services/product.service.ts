import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductResponseDto } from '../dto/product-response.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const entityData =
      this.productMapper.toEntityFromCreateDto(createProductDto);
    const product = this.productRepository.create(entityData);
    const savedProduct = await this.productRepository.save(product);
    return this.productMapper.toResponseDto(savedProduct);
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
      await this.productRepository.findAllWithPagination(skip, limit);

    const data = this.productMapper.toResponseDtoList(entities);

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

  async findOne(id: string): Promise<ProductResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product ID is required');
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return this.productMapper.toResponseDto(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product ID is required');
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    // Map update DTO to entity data
    const updateData =
      this.productMapper.toEntityFromUpdateDto(updateProductDto);
    Object.assign(product, updateData);
    const updatedProduct = await this.productRepository.save(product);

    return this.productMapper.toResponseDto(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product ID is required');
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepository.softDelete(product);
  }
}
