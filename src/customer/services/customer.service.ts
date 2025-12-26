import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerNotFoundException } from '../exceptions/customer-not-found.exception';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CustomerResponseDto } from '../dto/customer-response.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @Inject(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const entityData =
      this.customerMapper.toEntityFromCreateDto(createCustomerDto);
    const customer = this.customerRepository.create(entityData);
    const savedCustomer = await this.customerRepository.save(customer);
    return this.customerMapper.toResponseDto(savedCustomer);
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
      await this.customerRepository.findAllWithPagination(skip, limit);

    const data = this.customerMapper.toResponseDtoList(entities);

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

  async findOne(id: string): Promise<CustomerResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid customer ID is required');
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    return this.customerMapper.toResponseDto(customer);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid customer ID is required');
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    // Map update DTO to entity data
    const updateData =
      this.customerMapper.toEntityFromUpdateDto(updateCustomerDto);
    Object.assign(customer, updateData);
    const updatedCustomer = await this.customerRepository.save(customer);

    return this.customerMapper.toResponseDto(updatedCustomer);
  }

  async remove(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid customer ID is required');
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    await this.customerRepository.softDelete(customer);
  }
}
