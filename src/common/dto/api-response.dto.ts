import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: 200 })
  statusCode: number;
}

export class PaginatedApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message: string;

  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({
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

  @ApiProperty({ example: 200 })
  statusCode: number;
}
