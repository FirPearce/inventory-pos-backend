import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './controllers/supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { SupplierRepository } from './repositories/supplier.repository';
import { SupplierMapper } from './mappers/supplier.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository, SupplierMapper],
  exports: [SupplierService, SupplierRepository, SupplierMapper],
})
export class SupplierModule {}
