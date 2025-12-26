import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['category'],
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { sku, isDeleted: false },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Product[], number]> {
    return this.repository.findAndCount({
      where: { isDeleted: false },
      relations: ['category'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Product>): Product {
    return this.repository.create(data);
  }

  async save(entity: Product): Promise<Product> {
    return this.repository.save(entity);
  }

  async softDelete(entity: Product): Promise<Product> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find({
      where: { isDeleted: false },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }
}
