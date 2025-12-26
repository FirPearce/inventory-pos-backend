import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ProductUnitRepository } from '../repositories/product-unit.repository';
import { CreateProductUnitDto } from '../dto/create-product-unit.dto';
import { UpdateProductUnitDto } from '../dto/update-product-unit.dto';
import { ProductUnitNotFoundException } from '../exceptions/product-unit-not-found.exception';
import { ProductUnitMapper } from '../mappers/product-unit.mapper';
import { ProductUnitResponseDto } from '../dto/product-unit-response.dto';
import { ProductRepository } from '../repositories/product.repository';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

@Injectable()
export class ProductUnitService {
  private readonly logger = new Logger(ProductUnitService.name);

  constructor(
    @Inject(ProductUnitRepository)
    private readonly productUnitRepository: ProductUnitRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly productUnitMapper: ProductUnitMapper,
  ) {}

  async create(
    productId: string,
    createProductUnitDto: CreateProductUnitDto,
  ): Promise<ProductUnitResponseDto> {
    if (!productId || typeof productId !== 'string') {
      throw new BadRequestException('Valid product ID is required');
    }

    // Verify product exists
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    // Check if unit with same name already exists for this product
    const existingUnit =
      await this.productUnitRepository.findByProductIdAndUnitName(
        productId,
        createProductUnitDto.unitName,
      );
    if (existingUnit) {
      throw new BadRequestException(
        `Unit with name ${createProductUnitDto.unitName} already exists for this product`,
      );
    }

    const entityData = this.productUnitMapper.toEntityFromCreateDto(
      createProductUnitDto,
      productId,
    );
    const productUnit = this.productUnitRepository.create(entityData);
    const savedProductUnit = await this.productUnitRepository.save(productUnit);
    return this.productUnitMapper.toResponseDto(savedProductUnit);
  }

  async findAllByProductId(
    productId: string,
  ): Promise<ProductUnitResponseDto[]> {
    if (!productId || typeof productId !== 'string') {
      throw new BadRequestException('Valid product ID is required');
    }

    // Verify product exists
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }

    const entities =
      await this.productUnitRepository.findByProductId(productId);
    return this.productUnitMapper.toResponseDtoList(entities);
  }

  async findOne(id: string): Promise<ProductUnitResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    const productUnit = await this.productUnitRepository.findById(id);

    if (!productUnit) {
      throw new ProductUnitNotFoundException(id);
    }

    return this.productUnitMapper.toResponseDto(productUnit);
  }

  async update(
    id: string,
    updateProductUnitDto: UpdateProductUnitDto,
  ): Promise<ProductUnitResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    const productUnit = await this.productUnitRepository.findById(id);

    if (!productUnit) {
      throw new ProductUnitNotFoundException(id);
    }

    // If unitName is being updated, check for duplicates
    if (
      updateProductUnitDto.unitName !== undefined &&
      updateProductUnitDto.unitName !== productUnit.unitName
    ) {
      const existingUnit =
        await this.productUnitRepository.findByProductIdAndUnitName(
          productUnit.productId,
          updateProductUnitDto.unitName,
        );
      if (existingUnit && existingUnit.id !== id) {
        throw new BadRequestException(
          `Unit with name ${updateProductUnitDto.unitName} already exists for this product`,
        );
      }
    }

    // Map update DTO to entity data
    const updateData =
      this.productUnitMapper.toEntityFromUpdateDto(updateProductUnitDto);
    Object.assign(productUnit, updateData);
    const updatedProductUnit =
      await this.productUnitRepository.save(productUnit);

    return this.productUnitMapper.toResponseDto(updatedProductUnit);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    const productUnit = await this.productUnitRepository.findById(id);

    if (!productUnit) {
      throw new ProductUnitNotFoundException(id);
    }

    await this.productUnitRepository.softDelete(productUnit);
  }
}
