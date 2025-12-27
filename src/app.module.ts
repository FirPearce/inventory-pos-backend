import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/entities/supplier.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { ProductUnit } from './product/entities/product_unit.entity';
import { ProductUnitPrice } from './product/entities/product_unit_price.entity';
import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';
import { PurchaseModule } from './purchase/purchase.module';
import { Purchase } from './purchase/entities/purchase.entity';
import { PurchaseItem } from './purchase/entities/purchase-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'inventory_pos'),
        entities: [
          Category,
          Customer,
          Supplier,
          Product,
          ProductUnit,
          ProductUnitPrice,
          Stock,
          Purchase,
          PurchaseItem,
        ],
        migrations: ['dist/database/migrations/*.js'],
        synchronize:
          configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true' ||
          configService.get<string>('NODE_ENV', 'development') !== 'production',
        logging:
          configService.get<string>('NODE_ENV', 'development') ===
          'development',
        maxQueryExecutionTime: 1000,
        extra: {
          max: 10, // Maximum number of connections in pool
          connectionTimeoutMillis: 2000,
        },
      }),
      inject: [ConfigService],
    }),
    CategoryModule,
    CustomerModule,
    SupplierModule,
    ProductModule,
    StockModule,
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
