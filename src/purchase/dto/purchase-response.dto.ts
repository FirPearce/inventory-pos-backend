import { ApiProperty } from '@nestjs/swagger';

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'Purchase ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Supplier ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  supplierId: string;

  @ApiProperty({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
    type: String,
    nullable: true,
  })
  supplierName: string | null;

  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2024-001',
    type: String,
    nullable: true,
  })
  invoiceNumber: string | null;

  @ApiProperty({
    description: 'Total amount',
    example: 1000000.0,
    type: Number,
  })
  totalAmount: number;
}

export class PaginatedPurchaseResponseDto {
  @ApiProperty({
    description: 'List of purchases',
    type: [PurchaseResponseDto],
  })
  data: PurchaseResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
