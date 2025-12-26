import { NotFoundException } from '@nestjs/common';

export class ProductUnitNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Product unit with ID ${id} not found`);
  }
}
