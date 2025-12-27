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
import { PurchaseItemService } from '../services/purchase-item.service';
import { CreatePurchaseItemDto } from '../dto/create-purchase-item.dto';
import { UpdatePurchaseItemDto } from '../dto/update-purchase-item.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PurchaseItemResponseDto } from '../dto/purchase-item-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('purchase-items')
@Controller('purchase-items')
export class PurchaseItemController {
  constructor(private readonly purchaseItemService: PurchaseItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new purchase item' })
  @ApiStandardResponse(PurchaseItemResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPurchaseItemDto: CreatePurchaseItemDto) {
    return this.purchaseItemService.create(createPurchaseItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase items with pagination' })
  @ApiStandardResponse(PurchaseItemResponseDto, {
    isPaginated: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'purchaseId',
    required: false,
    type: String,
    description: 'Filter by purchase ID',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('purchaseId') purchaseId?: string,
  ) {
    return this.purchaseItemService.findAll(
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
      purchaseId,
    );
  }

  @Get('purchase/:purchaseId')
  @ApiOperation({ summary: 'Get all purchase items by purchase ID' })
  @ApiParam({
    name: 'purchaseId',
    type: String,
    description: 'Purchase UUID',
  })
  @ApiStandardResponse(PurchaseItemResponseDto, {
    isArray: true,
  })
  findByPurchaseId(@Param('purchaseId') purchaseId: string) {
    return this.purchaseItemService.findByPurchaseId(purchaseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase Item UUID' })
  @ApiStandardResponseWithNotFound(PurchaseItemResponseDto)
  findOne(@Param('id') id: string) {
    return this.purchaseItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a purchase item' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase Item UUID' })
  @ApiStandardResponseWithNotFound(PurchaseItemResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updatePurchaseItemDto: UpdatePurchaseItemDto,
  ) {
    return this.purchaseItemService.update(id, updatePurchaseItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a purchase item' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase Item UUID' })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Purchase item deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.purchaseItemService.remove(id);
  }
}
