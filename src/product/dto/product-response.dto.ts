import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'PRD-001',
    type: String,
    nullable: true,
  })
  sku: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Rokok Sampoerna Mild',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  categoryId: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'Sampoerna',
    type: String,
    nullable: true,
  })
  brand: string;
}

export class PaginatedProductResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

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
