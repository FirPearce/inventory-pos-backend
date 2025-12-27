import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { StockRepository } from '../repositories/stock.repository';
import { CreateStockDto } from '../dto/create-stock.dto';
import { AdjustStockDto } from '../dto/adjust-stock.dto';
import { StockByProductUnitNotFoundException } from '../exceptions/stock-not-found.exception';
import { StockMapper } from '../mappers/stock.mapper';
import { StockResponseDto } from '../dto/stock-response.dto';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @Inject(StockRepository)
    private readonly stockRepository: StockRepository,
    private readonly stockMapper: StockMapper,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<StockResponseDto> {
    const entityData = this.stockMapper.toEntityFromCreateDto(createStockDto);
    const stock = this.stockRepository.create(entityData);
    const savedStock = await this.stockRepository.save(stock);
    return this.stockMapper.toResponseDto(savedStock);
  }

  async findAll(page: number = 1, limit: number = 10) {
    // Validate pagination parameters
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    const [entities, total] = await this.stockRepository.findAllWithPagination(
      skip,
      limit,
    );

    const data = this.stockMapper.toResponseDtoList(entities);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByProductUnitId(productUnitId: string): Promise<StockResponseDto> {
    if (!productUnitId || typeof productUnitId !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    const stock = await this.stockRepository.findByProductUnitId(productUnitId);

    if (!stock) {
      throw new StockByProductUnitNotFoundException(productUnitId);
    }

    return this.stockMapper.toResponseDto(stock);
  }

  async adjust(adjustStockDto: AdjustStockDto): Promise<StockResponseDto> {
    const { productUnitId, quantityAdjustment } = adjustStockDto;

    if (!productUnitId || typeof productUnitId !== 'string') {
      throw new BadRequestException('Valid product unit ID is required');
    }

    const stock = await this.stockRepository.findByProductUnitId(productUnitId);

    if (!stock) {
      throw new StockByProductUnitNotFoundException(productUnitId);
    }

    // Calculate new quantity
    const currentQuantity = Number(stock.quantity);
    const newQuantity = currentQuantity + quantityAdjustment;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Insufficient stock. Current quantity: ${currentQuantity}, Adjustment: ${quantityAdjustment}`,
      );
    }

    // Update stock quantity
    stock.quantity = newQuantity;
    const updatedStock = await this.stockRepository.save(stock);

    return this.stockMapper.toResponseDto(updatedStock);
  }
}
