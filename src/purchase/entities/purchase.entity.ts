import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Supplier } from '../../supplier/entities/supplier.entity';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'invoice_number',
  })
  invoiceNumber: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'total_amount',
  })
  totalAmount: number;

  @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase)
  purchaseItems: PurchaseItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
