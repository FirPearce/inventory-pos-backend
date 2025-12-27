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
import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('purchases')
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiStandardResponse(PurchaseResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchases with pagination' })
  @ApiStandardResponse(PurchaseResponseDto, {
    isPaginated: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.purchaseService.findAll(
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase UUID' })
  @ApiStandardResponseWithNotFound(PurchaseResponseDto)
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a purchase' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase UUID' })
  @ApiStandardResponseWithNotFound(PurchaseResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a purchase' })
  @ApiParam({ name: 'id', type: String, description: 'Purchase UUID' })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Purchase deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}

