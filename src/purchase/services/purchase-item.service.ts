import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { PurchaseItem } from '../entities/purchase-item.entity';
import { PurchaseItemRepository } from '../repositories/purchase-item.repository';
import { CreatePurchaseItemDto } from '../dto/create-purchase-item.dto';
import { UpdatePurchaseItemDto } from '../dto/update-purchase-item.dto';
import { PurchaseItemNotFoundException } from '../exceptions/purchase-item-not-found.exception';
import { PurchaseItemMapper } from '../mappers/purchase-item.mapper';
import { PurchaseItemResponseDto } from '../dto/purchase-item-response.dto';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { ProductRepository } from '../../product/repositories/product.repository';
import { ProductUnitRepository } from '../../product/repositories/product-unit.repository';
import { StockRepository } from '../../stock/repositories/stock.repository';
import { Stock } from '../../stock/entities/stock.entity';

@Injectable()
export class PurchaseItemService {
  private readonly logger = new Logger(PurchaseItemService.name);

  constructor(
    @Inject(PurchaseItemRepository)
    private readonly purchaseItemRepository: PurchaseItemRepository,
    @Inject(PurchaseRepository)
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(ProductUnitRepository)
    private readonly productUnitRepository: ProductUnitRepository,
    @Inject(StockRepository)
    private readonly stockRepository: StockRepository,
    private readonly purchaseItemMapper: PurchaseItemMapper,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createPurchaseItemDto: CreatePurchaseItemDto,
  ): Promise<PurchaseItemResponseDto> {
    // Validate purchase exists
    const purchase = await this.purchaseRepository.findById(
      createPurchaseItemDto.purchaseId,
    );
    if (!purchase) {
      throw new BadRequestException(
        `Purchase with ID ${createPurchaseItemDto.purchaseId} not found`,
      );
    }

    // Validate product unit exists and get productId from it
    const productUnit = await this.productUnitRepository.findById(
      createPurchaseItemDto.productUnitId,
    );
    if (!productUnit) {
      throw new BadRequestException(
        `Product Unit with ID ${createPurchaseItemDto.productUnitId} not found`,
      );
    }

    // Validate product exists (from productUnit)
    const product = await this.productRepository.findById(
      productUnit.productId,
    );
    if (!product) {
      throw new BadRequestException(
        `Product with ID ${productUnit.productId} not found`,
      );
    }

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityData = this.purchaseItemMapper.toEntityFromCreateDto(
        createPurchaseItemDto,
        productUnit.productId,
      );
      const purchaseItem = this.purchaseItemRepository.create(entityData);
      const savedPurchaseItem = await queryRunner.manager.save(
        PurchaseItem,
        purchaseItem,
      );

      // Update stock: add quantity when purchase item is created
      await this.updateStockInTransaction(
        queryRunner,
        createPurchaseItemDto.productUnitId,
        createPurchaseItemDto.quantity,
      );

      await queryRunner.commitTransaction();

      return this.purchaseItemMapper.toResponseDto(savedPurchaseItem);
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to create purchase item: ${errorMessage}`,
        errorStack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10, purchaseId?: string) {
    // Validate pagination parameters
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    const [entities, total] =
      await this.purchaseItemRepository.findAllWithPagination(
        skip,
        limit,
        purchaseId,
      );

    const data = this.purchaseItemMapper.toResponseDtoList(entities);

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

  async findOne(id: string): Promise<PurchaseItemResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase item ID is required');
    }

    const purchaseItem = await this.purchaseItemRepository.findById(id);

    if (!purchaseItem) {
      throw new PurchaseItemNotFoundException(id);
    }

    return this.purchaseItemMapper.toResponseDto(purchaseItem);
  }

  async findByPurchaseId(
    purchaseId: string,
  ): Promise<PurchaseItemResponseDto[]> {
    if (!purchaseId || typeof purchaseId !== 'string') {
      throw new BadRequestException('Valid purchase ID is required');
    }

    const purchaseItems =
      await this.purchaseItemRepository.findByPurchaseId(purchaseId);
    return this.purchaseItemMapper.toResponseDtoList(purchaseItems);
  }

  async update(
    id: string,
    updatePurchaseItemDto: UpdatePurchaseItemDto,
  ): Promise<PurchaseItemResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase item ID is required');
    }

    const purchaseItem = await this.purchaseItemRepository.findById(id);

    if (!purchaseItem) {
      throw new PurchaseItemNotFoundException(id);
    }

    // Validate purchase if provided
    if (updatePurchaseItemDto.purchaseId) {
      const purchase = await this.purchaseRepository.findById(
        updatePurchaseItemDto.purchaseId,
      );
      if (!purchase) {
        throw new BadRequestException(
          `Purchase with ID ${updatePurchaseItemDto.purchaseId} not found`,
        );
      }
    }

    // Validate product unit if provided and get productId from it
    let productId: string | undefined;
    if (updatePurchaseItemDto.productUnitId) {
      const productUnit = await this.productUnitRepository.findById(
        updatePurchaseItemDto.productUnitId,
      );
      if (!productUnit) {
        throw new BadRequestException(
          `Product Unit with ID ${updatePurchaseItemDto.productUnitId} not found`,
        );
      }

      // Get productId from productUnit
      productId = productUnit.productId;

      // Validate product exists
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }
    }

    // Store old values for stock adjustment BEFORE any changes
    const oldQuantity = Number(purchaseItem.quantity);
    const oldProductUnitId = purchaseItem.productUnitId;

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Map update DTO to entity data
      const updateData = this.purchaseItemMapper.toEntityFromUpdateDto(
        updatePurchaseItemDto,
        productId,
      );
      Object.assign(purchaseItem, updateData);
      const updatedPurchaseItem = await queryRunner.manager.save(
        PurchaseItem,
        purchaseItem,
      );

      // Update stock based on changes
      const newQuantity = updatePurchaseItemDto.quantity
        ? Number(updatePurchaseItemDto.quantity)
        : oldQuantity;
      const newProductUnitId =
        updatePurchaseItemDto.productUnitId ?? oldProductUnitId;

      // If productUnitId changed, adjust stock for both old and new units
      if (updatePurchaseItemDto.productUnitId) {
        // Remove quantity from old product unit (using oldQuantity)
        await this.updateStockInTransaction(
          queryRunner,
          oldProductUnitId,
          -oldQuantity,
        );
        // Add quantity to new product unit (using newQuantity)
        await this.updateStockInTransaction(
          queryRunner,
          newProductUnitId,
          newQuantity,
        );
      } else if (updatePurchaseItemDto.quantity !== undefined) {
        // Only quantity changed, adjust stock for the same product unit
        // Calculate difference: newQuantity - oldQuantity
        const quantityDifference = newQuantity - oldQuantity;
        await this.updateStockInTransaction(
          queryRunner,
          oldProductUnitId,
          quantityDifference,
        );
      }

      await queryRunner.commitTransaction();

      return this.purchaseItemMapper.toResponseDto(updatedPurchaseItem);
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to update purchase item: ${errorMessage}`,
        errorStack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase item ID is required');
    }

    const purchaseItem = await this.purchaseItemRepository.findById(id);

    if (!purchaseItem) {
      throw new PurchaseItemNotFoundException(id);
    }

    // Store values before deletion
    const productUnitId = purchaseItem.productUnitId;
    const quantity = Number(purchaseItem.quantity);

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update stock: subtract quantity when purchase item is deleted
      await this.updateStockInTransaction(
        queryRunner,
        productUnitId,
        -quantity,
      );

      // Delete purchase item
      await queryRunner.manager.remove(PurchaseItem, purchaseItem);

      await queryRunner.commitTransaction();
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to delete purchase item: ${errorMessage}`,
        errorStack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update stock quantity for a product unit within a transaction
   * Uses pessimistic locking to prevent race conditions
   * @param queryRunner - Database query runner for transaction
   * @param productUnitId - Product Unit ID
   * @param quantityChange - Quantity to add (positive) or subtract (negative)
   */
  private async updateStockInTransaction(
    queryRunner: QueryRunner,
    productUnitId: string,
    quantityChange: number,
  ): Promise<void> {
    // Use pessimistic lock to prevent concurrent updates
    const stock = await queryRunner.manager
      .createQueryBuilder(Stock, 'stock')
      .where('stock.productUnitId = :productUnitId', { productUnitId })
      .setLock('pessimistic_write')
      .getOne();

    if (!stock) {
      this.logger.warn(
        `Stock not found for product unit ${productUnitId}. Stock will not be updated.`,
      );
      return;
    }

    // Calculate new quantity
    const currentQuantity = Number(stock.quantity);
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity < 0) {
      this.logger.warn(
        `Stock would become negative for product unit ${productUnitId}. Current: ${currentQuantity}, Change: ${quantityChange}`,
      );
      // Still update, but log warning (business decision: allow negative stock or throw error)
      // For now, we'll allow it but log a warning
    }

    // Update stock quantity within transaction
    stock.quantity = newQuantity;
    await queryRunner.manager.save(stock);

    this.logger.log(
      `Stock updated for product unit ${productUnitId}: ${currentQuantity} -> ${newQuantity} (change: ${quantityChange})`,
    );
  }
}
