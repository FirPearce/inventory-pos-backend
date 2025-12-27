import { NotFoundException } from '@nestjs/common';

export class PurchaseItemNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Purchase Item with ID ${id} not found`);
  }
}

