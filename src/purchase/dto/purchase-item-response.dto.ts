import { ApiProperty } from '@nestjs/swagger';

export class PurchaseItemResponseDto {
  @ApiProperty({
    description: 'Purchase Item ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Purchase ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  purchaseId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Rokok Sampoerna',
    type: String,
    nullable: true,
  })
  productName: string | null;

  @ApiProperty({
    description: 'Product Unit ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  productUnitId: string;

  @ApiProperty({
    description: 'Product Unit name',
    example: 'PACK',
    type: String,
    nullable: true,
  })
  productUnitName: string | null;

  @ApiProperty({
    description: 'Quantity',
    example: 10.0,
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 50000.0,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Subtotal',
    example: 500000.0,
    type: Number,
  })
  subtotal: number;
}

export class PaginatedPurchaseItemResponseDto {
  @ApiProperty({
    description: 'List of purchase items',
    type: [PurchaseItemResponseDto],
  })
  data: PurchaseItemResponseDto[];

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

