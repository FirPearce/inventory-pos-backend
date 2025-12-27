import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './services/stock.service';
import { StockController } from './controllers/stock.controller';
import { Stock } from './entities/stock.entity';
import { StockRepository } from './repositories/stock.repository';
import { StockMapper } from './mappers/stock.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, StockRepository, StockMapper],
  exports: [StockService, StockRepository, StockMapper],
})
export class StockModule {}
