import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductUnitPrice } from '../entities/product_unit_price.entity';

@Injectable()
export class ProductUnitPriceRepository {
  constructor(
    @InjectRepository(ProductUnitPrice)
    private readonly repository: Repository<ProductUnitPrice>,
  ) {}

  async findById(id: string): Promise<ProductUnitPrice | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['productUnit'],
    });
  }

  async findByProductUnitId(
    productUnitId: string,
  ): Promise<ProductUnitPrice[]> {
    return this.repository.find({
      where: { productUnitId, isDeleted: false },
      relations: ['productUnit'],
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<ProductUnitPrice>): ProductUnitPrice {
    return this.repository.create(data);
  }

  async save(entity: ProductUnitPrice): Promise<ProductUnitPrice> {
    return this.repository.save(entity);
  }

  async softDelete(entity: ProductUnitPrice): Promise<ProductUnitPrice> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }
}
