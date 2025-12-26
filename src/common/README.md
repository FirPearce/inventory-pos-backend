# Common Module

## Global API Response

Semua response API menggunakan format standard yang konsisten.

### Format Response

#### Success Response (Single Data)

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Category Name",
    ...
  },
  "statusCode": 200
}
```

#### Success Response (Paginated)

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "statusCode": 200
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Category not found",
    "error": "Not Found"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/categories/123"
}
```

## Penggunaan di Module Lain

### 1. Menggunakan ApiStandardResponse Decorator

```typescript
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';
import { YourResponseDto } from '../dto/your-response.dto';

@Controller('your-resource')
export class YourController {
  @Get()
  @ApiStandardResponse(YourResponseDto, {
    status: 200,
    description: 'Data retrieved successfully',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('paginated')
  @ApiStandardResponse(YourResponseDto, {
    status: 200,
    description: 'Data retrieved successfully',
    isPaginated: true, // Untuk paginated response
  })
  findAllPaginated() {
    return this.service.findAllPaginated();
  }
}
```

### 2. Response Interceptor

Response interceptor sudah terdaftar secara global di `main.ts`, jadi semua response akan otomatis di-wrap dengan format standard.

Tidak perlu melakukan apapun di service atau controller - response akan otomatis di-format.

### 3. Interface Types

```typescript
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../../common/interfaces/api-response.interface';

// Untuk single data
const response: ApiResponse<YourDataType> = {
  success: true,
  message: 'Success',
  data: yourData,
  statusCode: 200,
};

// Untuk paginated data
const response: PaginatedApiResponse<YourDataType> = {
  success: true,
  message: 'Success',
  data: yourDataArray,
  meta: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
  },
  statusCode: 200,
};
```

## Catatan

- Response interceptor otomatis wrap semua success response
- Error response sudah di-handle oleh HttpExceptionFilter
- Tidak perlu mengubah return type di service - interceptor akan handle formatting
- Untuk paginated response, pastikan service return object dengan `data` dan `meta` properties
