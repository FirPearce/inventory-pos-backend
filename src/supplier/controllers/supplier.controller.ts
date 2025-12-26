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
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SupplierResponseDto } from '../dto/supplier-response.dto';
import {
  ApiStandardResponse,
  ApiStandardResponseWithNotFound,
} from '../../common/decorators/api-standard-responses.decorator';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiStandardResponse(SupplierResponseDto, {
    status: HttpStatus.CREATED,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all suppliers with pagination' })
  @ApiStandardResponse(SupplierResponseDto, {
    isPaginated: true,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.supplierService.findAll(
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Supplier UUID' })
  @ApiStandardResponseWithNotFound(SupplierResponseDto)
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({ name: 'id', type: String, description: 'Supplier UUID' })
  @ApiStandardResponseWithNotFound(SupplierResponseDto)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a supplier (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'Supplier UUID' })
  @ApiStandardResponseWithNotFound(null, {
    status: HttpStatus.OK,
    description: 'Supplier deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
