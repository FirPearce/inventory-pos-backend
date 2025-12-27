import { NotFoundException } from '@nestjs/common';

export class StockNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Stock with ID ${id} not found`);
  }
}

export class StockByProductUnitNotFoundException extends NotFoundException {
  constructor(productUnitId: string) {
    super(`Stock with Product Unit ID ${productUnitId} not found`);
  }
}
