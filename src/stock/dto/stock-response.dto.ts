import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
  @ApiProperty({
    description: 'Stock ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  productId: string;

  @ApiProperty({
    description: 'Product Unit ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  productUnitId: string;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100.5,
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: 'Minimum stock level',
    example: 10.0,
    type: Number,
  })
  minimumStock: number;
}

export class PaginatedStockResponseDto {
  @ApiProperty({
    description: 'List of stocks',
    type: [StockResponseDto],
  })
  data: StockResponseDto[];

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
