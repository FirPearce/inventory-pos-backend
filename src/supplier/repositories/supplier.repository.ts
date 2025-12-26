import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';

@Injectable()
export class SupplierRepository {
  constructor(
    @InjectRepository(Supplier)
    private readonly repository: Repository<Supplier>,
  ) {}

  async findById(id: string): Promise<Supplier | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findByName(name: string): Promise<Supplier | null> {
    return this.repository.findOne({
      where: { name, isDeleted: false },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Supplier[], number]> {
    return this.repository.findAndCount({
      where: { isDeleted: false },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Supplier>): Supplier {
    return this.repository.create(data);
  }

  async save(entity: Supplier): Promise<Supplier> {
    return this.repository.save(entity);
  }

  async softDelete(entity: Supplier): Promise<Supplier> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }

  async findAll(): Promise<Supplier[]> {
    return this.repository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }
}
