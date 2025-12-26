import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { name, isDeleted: false },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[Category[], number]> {
    return this.repository.findAndCount({
      where: { isDeleted: false },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<Category>): Category {
    return this.repository.create(data);
  }

  async save(entity: Category): Promise<Category> {
    return this.repository.save(entity);
  }

  async softDelete(entity: Category): Promise<Category> {
    entity.isDeleted = true;
    return this.repository.save(entity);
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }
}
