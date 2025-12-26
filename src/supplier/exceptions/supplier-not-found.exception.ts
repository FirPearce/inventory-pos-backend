import { NotFoundException } from '@nestjs/common';

export class SupplierNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Supplier with ID ${id} not found`);
  }
}
