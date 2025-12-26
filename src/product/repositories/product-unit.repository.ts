import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductUnit } from '../entities/product_unit.entity';
import { UnitName } from '../enums';

@Injectable()
export class ProductUnitRepository {
  constructor(
    @InjectRepository(ProductUnit)
    private readonly repository: Repository<ProductUnit>,
  ) {}

  async findById(id: string): Promise<ProductUnit | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['product'],
    });
  }

  async findByProductId(productId: string): Promise<ProductUnit[]> {
    return this.repository.find({
      where: { productId, isDeleted: false },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductIdAndUnitName(
    productId: string,
    unitName: string,
  ): Promise<ProductUnit | null> {
    return this.repository.findOne({
      where: { productId, unitName: unitName as UnitName, isDeleted: false },
    });
  }

  create(data: Partial<ProductUnit>): ProductUnit {
    return this.repository.create(data);
  }

  async save(entity: ProductUnit): Promise<ProductUnit> {
    return this.repository.save(entity);
  }

  async softDelete(entity: ProductUnit): Promise<ProductUnit> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }
}
