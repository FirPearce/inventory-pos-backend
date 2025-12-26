import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Supplier phone number',
    example: '+6281234567890',
    type: String,
    nullable: true,
  })
  phone: string;

  @ApiProperty({
    description: 'Supplier address',
    example: 'Jl. Raya No. 123, Jakarta',
    type: String,
    nullable: true,
  })
  address: string;
}

export class PaginatedSupplierResponseDto {
  @ApiProperty({
    description: 'List of suppliers',
    type: [SupplierResponseDto],
  })
  data: SupplierResponseDto[];

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
