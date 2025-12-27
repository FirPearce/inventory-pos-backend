import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class StockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repository: Repository<Stock>,
  ) {}

  async findById(id: string): Promise<Stock | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['product', 'productUnit'],
    });
  }

  async findByProductUnitId(productUnitId: string): Promise<Stock | null> {
    return this.repository.findOne({
      where: { productUnitId },
      relations: ['product', 'productUnit'],
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Stock[], number]> {
    return this.repository.findAndCount({
      relations: ['product', 'productUnit'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Stock[]> {
    return this.repository.find({
      relations: ['product', 'productUnit'],
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Stock>): Stock {
    return this.repository.create(data);
  }

  async save(entity: Stock): Promise<Stock> {
    return this.repository.save(entity);
  }
}
