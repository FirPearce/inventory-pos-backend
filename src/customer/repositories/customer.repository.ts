import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Customer[], number]> {
    return this.repository.findAndCount({
      where: { isDeleted: false },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Customer>): Customer {
    return this.repository.create(data);
  }

  async save(entity: Customer): Promise<Customer> {
    return this.repository.save(entity);
  }

  async softDelete(entity: Customer): Promise<Customer> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }

  async findAll(): Promise<Customer[]> {
    return this.repository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }
}

