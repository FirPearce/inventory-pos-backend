import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductUnitController } from './controllers/product-unit.controller';
import { ProductUnitPriceController } from './controllers/product-unit-price.controller';
import { Product } from './entities/product.entity';
import { ProductUnit } from './entities/product_unit.entity';
import { ProductUnitPrice } from './entities/product_unit_price.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductUnitRepository } from './repositories/product-unit.repository';
import { ProductUnitPriceRepository } from './repositories/product-unit-price.repository';
import { ProductMapper } from './mappers/product.mapper';
import { ProductUnitMapper } from './mappers/product-unit.mapper';
import { ProductUnitPriceMapper } from './mappers/product-unit-price.mapper';
import { ProductUnitService } from './services/product-unit.service';
import { ProductUnitPriceService } from './services/product-unit-price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductUnit, ProductUnitPrice])],
  controllers: [
    ProductController,
    ProductUnitController,
    ProductUnitPriceController,
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductMapper,
    ProductUnitService,
    ProductUnitRepository,
    ProductUnitMapper,
    ProductUnitPriceService,
    ProductUnitPriceRepository,
    ProductUnitPriceMapper,
  ],
  exports: [
    ProductService,
    ProductRepository,
    ProductMapper,
    ProductUnitService,
    ProductUnitRepository,
    ProductUnitMapper,
    ProductUnitPriceService,
    ProductUnitPriceRepository,
    ProductUnitPriceMapper,
  ],
})
export class ProductModule {}
