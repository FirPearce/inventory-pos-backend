import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ProductUnitPriceService } from '../services/product-unit-price.service';
import { CreateProductUnitPriceDto } from '../dto/create-product-unit-price.dto';
import { UpdateProductUnitPriceDto } from '../dto/update-product-unit-price.dto';
import { ProductUnitPriceResponseDto } from '../dto/product-unit-price-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('product-unit-prices')
@Controller()
export class ProductUnitPriceController {
  constructor(
    private readonly productUnitPriceService: ProductUnitPriceService,
  ) {}

  @Post('units/:id/prices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new price to a product unit' })
  @ApiParam({ name: 'id', type: String, description: 'Product Unit UUID' })
  @ApiStandardResponse(ProductUnitPriceResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Param('id') productUnitId: string,
    @Body() createProductUnitPriceDto: CreateProductUnitPriceDto,
  ) {
    return this.productUnitPriceService.create(
      productUnitId,
      createProductUnitPriceDto,
    );
  }

  @Get('units/:id/prices')
  @ApiOperation({ summary: 'Get all prices for a product unit' })
  @ApiParam({ name: 'id', type: String, description: 'Product Unit UUID' })
  @ApiStandardResponse(ProductUnitPriceResponseDto, {
    isArray: true,
  })
  findAllByProductUnitId(@Param('id') productUnitId: string) {
    return this.productUnitPriceService.findAllByProductUnitId(productUnitId);
  }

  @Put('prices/:priceId')
  @ApiOperation({ summary: 'Update a product unit price' })
  @ApiParam({
    name: 'priceId',
    type: String,
    description: 'Product Unit Price UUID',
  })
  @ApiStandardResponseWithNotFound(ProductUnitPriceResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('priceId') priceId: string,
    @Body() updateProductUnitPriceDto: UpdateProductUnitPriceDto,
  ) {
    return this.productUnitPriceService.update(
      priceId,
      updateProductUnitPriceDto,
    );
  }

  @Delete('prices/:priceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a product unit price (soft delete)' })
  @ApiParam({
    name: 'priceId',
    type: String,
    description: 'Product Unit Price UUID',
  })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Product unit price deactivated successfully',
  })
  deactivate(@Param('priceId') priceId: string) {
    return this.productUnitPriceService.deactivate(priceId);
  }
}
