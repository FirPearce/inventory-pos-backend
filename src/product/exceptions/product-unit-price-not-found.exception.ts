import { NotFoundException } from '@nestjs/common';

export class ProductUnitPriceNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Product unit price with ID ${id} not found`);
  }
}
