import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';

@Injectable()
export class PurchaseRepository {
  constructor(
    @InjectRepository(Purchase)
    private readonly repository: Repository<Purchase>,
  ) {}

  async findById(id: string): Promise<Purchase | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['supplier', 'purchaseItems'],
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Purchase[], number]> {
    return this.repository.findAndCount({
      relations: ['supplier', 'purchaseItems'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Purchase>): Purchase {
    return this.repository.create(data);
  }

  async save(entity: Purchase): Promise<Purchase> {
    return this.repository.save(entity);
  }

  async remove(entity: Purchase): Promise<Purchase> {
    return this.repository.remove(entity);
  }

  async findAll(): Promise<Purchase[]> {
    return this.repository.find({
      relations: ['supplier', 'purchaseItems'],
      order: { createdAt: 'DESC' },
    });
  }
}
