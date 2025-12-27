import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StockService } from '../services/stock.service';
import { CreateStockDto } from '../dto/create-stock.dto';
import { AdjustStockDto } from '../dto/adjust-stock.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { StockResponseDto } from '../dto/stock-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock' })
  @ApiStandardResponse(StockResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stocks with pagination' })
  @ApiStandardResponse(StockResponseDto, {
    isPaginated: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.stockService.findAll(
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  @Get(':productUnitId')
  @ApiOperation({ summary: 'Get stock by product unit ID' })
  @ApiParam({
    name: 'productUnitId',
    type: String,
    description: 'Product Unit UUID',
  })
  @ApiStandardResponseWithNotFound(StockResponseDto)
  findByProductUnitId(@Param('productUnitId') productUnitId: string) {
    return this.stockService.findByProductUnitId(productUnitId);
  }

  @Post('adjust')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Adjust stock quantity' })
  @ApiStandardResponse(StockResponseDto, {
    status: HttpStatus.OK,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  adjust(@Body() adjustStockDto: AdjustStockDto) {
    return this.stockService.adjust(adjustStockDto);
  }
}
