import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Rokok',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Berbagai macam rokok',
    type: String,
    nullable: true,
  })
  description: string;
}

export class PaginatedCategoryResponseDto {
  @ApiProperty({
    description: 'List of categories',
    type: [CategoryResponseDto],
  })
  data: CategoryResponseDto[];

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
