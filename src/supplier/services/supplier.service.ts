import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SupplierNotFoundException } from '../exceptions/supplier-not-found.exception';
import { SupplierMapper } from '../mappers/supplier.mapper';
import { SupplierResponseDto } from '../dto/supplier-response.dto';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(
    @Inject(SupplierRepository)
    private readonly supplierRepository: SupplierRepository,
    private readonly supplierMapper: SupplierMapper,
  ) {}

  async create(
    createSupplierDto: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const entityData =
      this.supplierMapper.toEntityFromCreateDto(createSupplierDto);
    const supplier = this.supplierRepository.create(entityData);
    const savedSupplier = await this.supplierRepository.save(supplier);
    return this.supplierMapper.toResponseDto(savedSupplier);
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
      await this.supplierRepository.findAllWithPagination(skip, limit);

    const data = this.supplierMapper.toResponseDtoList(entities);

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

  async findOne(id: string): Promise<SupplierResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid supplier ID is required');
    }

    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new SupplierNotFoundException(id);
    }

    return this.supplierMapper.toResponseDto(supplier);
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid supplier ID is required');
    }

    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new SupplierNotFoundException(id);
    }

    // Map update DTO to entity data
    const updateData =
      this.supplierMapper.toEntityFromUpdateDto(updateSupplierDto);
    Object.assign(supplier, updateData);
    const updatedSupplier = await this.supplierRepository.save(supplier);

    return this.supplierMapper.toResponseDto(updatedSupplier);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid supplier ID is required');
    }

    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new SupplierNotFoundException(id);
    }

    await this.supplierRepository.softDelete(supplier);
  }
}
