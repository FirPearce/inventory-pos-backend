import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseItem } from '../entities/purchase-item.entity';

@Injectable()
export class PurchaseItemRepository {
  constructor(
    @InjectRepository(PurchaseItem)
    private readonly repository: Repository<PurchaseItem>,
  ) {}

  async findById(id: string): Promise<PurchaseItem | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['purchase', 'product', 'productUnit'],
    });
  }

  async findByPurchaseId(purchaseId: string): Promise<PurchaseItem[]> {
    return this.repository.find({
      where: { purchaseId },
      relations: ['purchase', 'product', 'productUnit'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
    purchaseId?: string,
  ): Promise<[PurchaseItem[], number]> {
    const where: any = {};
    if (purchaseId) {
      where.purchaseId = purchaseId;
    }

    return this.repository.findAndCount({
      where,
      relations: ['purchase', 'product', 'productUnit'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<PurchaseItem>): PurchaseItem {
    return this.repository.create(data);
  }

  async save(entity: PurchaseItem): Promise<PurchaseItem> {
    return this.repository.save(entity);
  }

  async remove(entity: PurchaseItem): Promise<PurchaseItem> {
    return this.repository.remove(entity);
  }

  async findAll(purchaseId?: string): Promise<PurchaseItem[]> {
    const where: any = {};
    if (purchaseId) {
      where.purchaseId = purchaseId;
    }

    return this.repository.find({
      where,
      relations: ['purchase', 'product', 'productUnit'],
      order: { createdAt: 'DESC' },
    });
  }
}

