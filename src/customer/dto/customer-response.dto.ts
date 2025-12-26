import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'Customer ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+6281234567890',
    type: String,
    nullable: true,
  })
  phone: string;

  @ApiProperty({
    description: 'Customer address',
    example: 'Jl. Sudirman No. 123, Jakarta',
    type: String,
    nullable: true,
  })
  address: string;
}

export class PaginatedCustomerResponseDto {
  @ApiProperty({
    description: 'List of customers',
    type: [CustomerResponseDto],
  })
  data: CustomerResponseDto[];

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

