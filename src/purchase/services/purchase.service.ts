import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { PurchaseNotFoundException } from '../exceptions/purchase-not-found.exception';
import { PurchaseMapper } from '../mappers/purchase.mapper';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';
import { SupplierRepository } from '../../supplier/repositories/supplier.repository';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    @Inject(PurchaseRepository)
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(SupplierRepository)
    private readonly supplierRepository: SupplierRepository,
    private readonly purchaseMapper: PurchaseMapper,
  ) {}

  async create(
    createPurchaseDto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    // Validate supplier exists
    const supplier = await this.supplierRepository.findById(
      createPurchaseDto.supplierId,
    );
    if (!supplier) {
      throw new BadRequestException(
        `Supplier with ID ${createPurchaseDto.supplierId} not found`,
      );
    }

    const entityData =
      this.purchaseMapper.toEntityFromCreateDto(createPurchaseDto);
    const purchase = this.purchaseRepository.create(entityData);
    const savedPurchase = await this.purchaseRepository.save(purchase);
    return this.purchaseMapper.toResponseDto(savedPurchase);
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
      await this.purchaseRepository.findAllWithPagination(skip, limit);

    const data = this.purchaseMapper.toResponseDtoList(entities);

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

  async findOne(id: string): Promise<PurchaseResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase ID is required');
    }

    const purchase = await this.purchaseRepository.findById(id);

    if (!purchase) {
      throw new PurchaseNotFoundException(id);
    }

    return this.purchaseMapper.toResponseDto(purchase);
  }

  async update(
    id: string,
    updatePurchaseDto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase ID is required');
    }

    const purchase = await this.purchaseRepository.findById(id);

    if (!purchase) {
      throw new PurchaseNotFoundException(id);
    }

    // Validate supplier if provided
    if (updatePurchaseDto.supplierId) {
      const supplier = await this.supplierRepository.findById(
        updatePurchaseDto.supplierId,
      );
      if (!supplier) {
        throw new BadRequestException(
          `Supplier with ID ${updatePurchaseDto.supplierId} not found`,
        );
      }
    }

    // Map update DTO to entity data
    const updateData =
      this.purchaseMapper.toEntityFromUpdateDto(updatePurchaseDto);
    Object.assign(purchase, updateData);
    const updatedPurchase = await this.purchaseRepository.save(purchase);

    return this.purchaseMapper.toResponseDto(updatedPurchase);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid purchase ID is required');
    }

    const purchase = await this.purchaseRepository.findById(id);

    if (!purchase) {
      throw new PurchaseNotFoundException(id);
    }

    await this.purchaseRepository.remove(purchase);
  }
}
