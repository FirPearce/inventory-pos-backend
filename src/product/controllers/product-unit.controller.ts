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
import { ProductUnitService } from '../services/product-unit.service';
import { CreateProductUnitDto } from '../dto/create-product-unit.dto';
import { UpdateProductUnitDto } from '../dto/update-product-unit.dto';
import { ProductUnitResponseDto } from '../dto/product-unit-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('product-units')
@Controller()
export class ProductUnitController {
  constructor(private readonly productUnitService: ProductUnitService) {}

  @Post('products/:id/units')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new unit to a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiStandardResponse(ProductUnitResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Param('id') productId: string,
    @Body() createProductUnitDto: CreateProductUnitDto,
  ) {
    return this.productUnitService.create(productId, createProductUnitDto);
  }

  @Get('products/:id/units')
  @ApiOperation({ summary: 'Get all units for a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product UUID' })
  @ApiStandardResponse(ProductUnitResponseDto, {
    isArray: true,
  })
  findAllByProductId(@Param('id') productId: string) {
    return this.productUnitService.findAllByProductId(productId);
  }

  @Put('units/:unitId')
  @ApiOperation({ summary: 'Update a product unit' })
  @ApiParam({ name: 'unitId', type: String, description: 'Product Unit UUID' })
  @ApiStandardResponseWithNotFound(ProductUnitResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('unitId') unitId: string,
    @Body() updateProductUnitDto: UpdateProductUnitDto,
  ) {
    return this.productUnitService.update(unitId, updateProductUnitDto);
  }

  @Delete('units/:unitId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a product unit (soft delete)' })
  @ApiParam({ name: 'unitId', type: String, description: 'Product Unit UUID' })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Product unit deleted successfully',
  })
  remove(@Param('unitId') unitId: string) {
    return this.productUnitService.remove(unitId);
  }
}
