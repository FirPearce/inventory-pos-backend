import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductUnit } from './product_unit.entity';
import { PriceType } from '../enums';

@Entity('product_unit_prices')
export class ProductUnitPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductUnit)
  @JoinColumn({ name: 'product_unit_id' })
  productUnit: ProductUnit;

  @Column({ name: 'product_unit_id', type: 'uuid' })
  productUnitId: string;

  @Column({
    type: 'enum',
    enum: PriceType,
    name: 'price_type',
  })
  priceType: PriceType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'minimum_qty',
  })
  minimumQty: number;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
