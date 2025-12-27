import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';
import { PurchaseItemController } from './controllers/purchase-item.controller';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchaseRepository } from './repositories/purchase.repository';
import { PurchaseItemRepository } from './repositories/purchase-item.repository';
import { PurchaseMapper } from './mappers/purchase.mapper';
import { PurchaseItemMapper } from './mappers/purchase-item.mapper';
import { PurchaseItemService } from './services/purchase-item.service';
import { SupplierModule } from '../supplier/supplier.module';
import { ProductModule } from '../product/product.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseItem]),
    SupplierModule,
    ProductModule,
    StockModule,
  ],
  controllers: [PurchaseController, PurchaseItemController],
  providers: [
    PurchaseService,
    PurchaseRepository,
    PurchaseMapper,
    PurchaseItemService,
    PurchaseItemRepository,
    PurchaseItemMapper,
  ],
  exports: [
    PurchaseService,
    PurchaseRepository,
    PurchaseMapper,
    PurchaseItemService,
    PurchaseItemRepository,
    PurchaseItemMapper,
  ],
})
export class PurchaseModule {}
