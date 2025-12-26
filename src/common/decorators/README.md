# API Response Decorators

Decorator yang memudahkan dokumentasi Swagger dengan format response standard yang konsisten.

## Penggunaan

### 1. ApiStandardResponse

Decorator dasar untuk standard API response. Auto-include common error responses (400, 500).

```typescript
@Get()
@ApiStandardResponse(CategoryResponseDto)
findAll() {
  return this.service.findAll();
}
```

**Options:**

- `status?: number` - HTTP status code (default: 200)
- `description?: string` - Custom description (auto-generated jika tidak diisi)
- `isArray?: boolean` - Untuk array response
- `isPaginated?: boolean` - Untuk paginated response
- `includeErrors?: boolean` - Include common errors (default: true)

**Contoh dengan options:**

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiStandardResponse(CategoryResponseDto, {
  status: HttpStatus.CREATED,
})
create(@Body() dto: CreateCategoryDto) {
  return this.service.create(dto);
}

@Get()
@ApiStandardResponse(CategoryResponseDto, {
  isPaginated: true,
})
findAll() {
  return this.service.findAll();
}
```

### 2. ApiStandardResponseWithNotFound

Decorator yang auto-include NotFound (404) error response. Cocok untuk GET by ID, UPDATE, DELETE.

```typescript
@Get(':id')
@ApiStandardResponseWithNotFound(CategoryResponseDto)
findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}

@Patch(':id')
@ApiStandardResponseWithNotFound(CategoryResponseDto)
update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
  return this.service.update(id, dto);
}

@Delete(':id')
@ApiStandardResponseWithNotFound(null, {
  status: HttpStatus.OK,
  description: 'Category deleted successfully',
})
remove(@Param('id') id: string) {
  return this.service.remove(id);
}
```

**Auto-include errors:**

- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

## Keuntungan

1. **Lebih sederhana** - Tidak perlu set ApiResponse manual untuk setiap status code
2. **Konsisten** - Semua response menggunakan format standard yang sama
3. **Auto-generated** - Description otomatis berdasarkan status code
4. **DRY** - Tidak perlu repeat error responses di setiap endpoint
5. **Type-safe** - Full TypeScript support

## Before vs After

### Before (Manual):

```typescript
@Get(':id')
@ApiResponse({ status: 200, description: 'Success', type: CategoryResponseDto })
@ApiResponse({ status: 404, description: 'Not found' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Internal server error' })
findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}
```

### After (Dengan Decorator):

```typescript
@Get(':id')
@ApiStandardResponseWithNotFound(CategoryResponseDto)
findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}
```

## Auto-generated Descriptions

Decorator otomatis generate description berdasarkan status code:

- `200 OK` → "Operation successful"
- `201 Created` → "Resource created successfully"
- `204 No Content` → "Resource deleted successfully"

Anda bisa override dengan memberikan `description` di options.
