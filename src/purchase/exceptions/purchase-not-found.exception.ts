import { NotFoundException } from '@nestjs/common';

export class PurchaseNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Purchase with ID ${id} not found`);
  }
}
