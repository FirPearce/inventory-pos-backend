import { NotFoundException } from '@nestjs/common';

export class CustomerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Customer with ID ${id} not found`);
  }
}

