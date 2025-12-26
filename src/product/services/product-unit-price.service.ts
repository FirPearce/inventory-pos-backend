import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ProductUnitPriceRepository } from '../repositories/product-unit-price.repository';
import { CreateProductUnitPriceDto } from '../dto/create-product-unit-price.dto';
import { UpdateProductUnitPriceDto } from '../dto/update-product-unit-price.dto';
import { ProductUnitPriceNotFoundException } from '../exceptions/product-unit-price-not-found.exception';
import { ProductUnitPriceMapper } from '../mappers/product-unit-price.mapper';
import { ProductUnitPriceResponseDto } from '../dto/product-unit-price-response.dto';
import { ProductUnitRepository } from '../repositories/product-unit.repository';
import { ProductUnitNotFoundException } from '../exceptions/product-unit-not-found.exception';

@Injectable()
export class ProductUnitPriceService {
  private readonly logger = new Logger(ProductUnitPriceService.name);

  constructor(
    @Inject(ProductUnitPriceRepository)
    private readonly productUnitPriceRepository: ProductUnitPriceRepository,
    @Inject(ProductUnitRepository)
    private readonly productUnitRepository: ProductUnitRepository,
    private readonly productUnitPriceMapper: ProductUnitPriceMapper,
  ) {}

  async create(
    productUnitId: string,
    createProductUnitPriceDto: CreateProductUnitPriceDto,
  ): Promise<ProductUnitPriceResponseDto> {
    if (!productUnitId || typeof productUnitId !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    // Verify product unit exists
    const productUnit =
      await this.productUnitRepository.findById(productUnitId);
    if (!productUnit) {
      throw new ProductUnitNotFoundException(productUnitId);
    }

    // Validate date range if both dates are provided
    if (
      createProductUnitPriceDto.startDate &&
      createProductUnitPriceDto.endDate
    ) {
      if (
        createProductUnitPriceDto.startDate > createProductUnitPriceDto.endDate
      ) {
        throw new BadRequestException(
          'Start date must be before or equal to end date',
        );
      }
    }

    const entityData = this.productUnitPriceMapper.toEntityFromCreateDto(
      createProductUnitPriceDto,
      productUnitId,
    );
    const productUnitPrice = this.productUnitPriceRepository.create(entityData);
    const savedProductUnitPrice =
      await this.productUnitPriceRepository.save(productUnitPrice);
    return this.productUnitPriceMapper.toResponseDto(savedProductUnitPrice);
  }

  async findAllByProductUnitId(
    productUnitId: string,
  ): Promise<ProductUnitPriceResponseDto[]> {
    if (!productUnitId || typeof productUnitId !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    // Verify product unit exists
    const productUnit =
      await this.productUnitRepository.findById(productUnitId);
    if (!productUnit) {
      throw new ProductUnitNotFoundException(productUnitId);
    }

    const entities =
      await this.productUnitPriceRepository.findByProductUnitId(productUnitId);
    return this.productUnitPriceMapper.toResponseDtoList(entities);
  }

  async findOne(id: string): Promise<ProductUnitPriceResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit price ID is required');
    }

    const productUnitPrice = await this.productUnitPriceRepository.findById(id);

    if (!productUnitPrice) {
      throw new ProductUnitPriceNotFoundException(id);
    }

    return this.productUnitPriceMapper.toResponseDto(productUnitPrice);
  }

  async update(
    id: string,
    updateProductUnitPriceDto: UpdateProductUnitPriceDto,
  ): Promise<ProductUnitPriceResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit price ID is required');
    }

    const productUnitPrice = await this.productUnitPriceRepository.findById(id);

    if (!productUnitPrice) {
      throw new ProductUnitPriceNotFoundException(id);
    }

    // Validate date range if both dates are provided
    const startDate =
      updateProductUnitPriceDto.startDate !== undefined
        ? updateProductUnitPriceDto.startDate
        : productUnitPrice.startDate;
    const endDate =
      updateProductUnitPriceDto.endDate !== undefined
        ? updateProductUnitPriceDto.endDate
        : productUnitPrice.endDate;

    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException(
        'Start date must be before or equal to end date',
      );
    }

    // Map update DTO to entity data
    const updateData = this.productUnitPriceMapper.toEntityFromUpdateDto(
      updateProductUnitPriceDto,
    );
    Object.assign(productUnitPrice, updateData);
    const updatedProductUnitPrice =
      await this.productUnitPriceRepository.save(productUnitPrice);

    return this.productUnitPriceMapper.toResponseDto(updatedProductUnitPrice);
  }

  async deactivate(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit price ID is required');
    }

    const productUnitPrice = await this.productUnitPriceRepository.findById(id);

    if (!productUnitPrice) {
      throw new ProductUnitPriceNotFoundException(id);
    }

    await this.productUnitPriceRepository.softDelete(productUnitPrice);
  }
}
