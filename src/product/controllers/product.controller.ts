import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiStandardResponse(ProductResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiStandardResponse(ProductResponseDto, {
    isPaginated: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.productService.findAll(
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiStandardResponseWithNotFound(ProductResponseDto)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiStandardResponseWithNotFound(ProductResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
