import { applyDecorators, Type, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  PaginatedApiResponseDto,
} from '../dto/api-response.dto';

type Decorator =
  | ReturnType<typeof ApiResponse>
  | ReturnType<typeof ApiExtraModels>;

interface ApiStandardResponseOptions {
  status?: number;
  description?: string;
  isArray?: boolean;
  isPaginated?: boolean;
  includeErrors?: boolean;
}

/**
 * Decorator untuk standard API response dengan auto-detection
 * @param dataDto - DTO class untuk response data
 * @param options - Optional configuration
 */
export const ApiStandardResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: ApiStandardResponseOptions,
) => {
  const status = options?.status || HttpStatus.OK;
  const description = options?.description || getDefaultDescription(status);
  const isArray = options?.isArray || false;
  const isPaginated = options?.isPaginated || false;
  const includeErrors = options?.includeErrors !== false; // Default true

  const decorators: Decorator[] = [];

  // Add success response
  if (isPaginated) {
    decorators.push(
      ApiExtraModels(PaginatedApiResponseDto, dataDto),
      ApiResponse({
        status,
        description,
        schema: {
          allOf: [
            { $ref: getSchemaPath(PaginatedApiResponseDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(dataDto) },
                },
              },
            },
          ],
        },
      }),
    );
  } else if (isArray) {
    decorators.push(
      ApiExtraModels(ApiResponseDto, dataDto),
      ApiResponse({
        status,
        description,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(dataDto) },
                },
              },
            },
          ],
        },
      }),
    );
  } else {
    decorators.push(
      ApiExtraModels(ApiResponseDto, dataDto),
      ApiResponse({
        status,
        description,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                data: { $ref: getSchemaPath(dataDto) },
              },
            },
          ],
        },
      }),
    );
  }

  // Add common error responses if enabled
  if (includeErrors) {
    decorators.push(
      ApiBadRequestResponse({
        description: 'Bad request - validation failed',
      }),
      ApiInternalServerErrorResponse({
        description: 'Internal server error',
      }),
    );
  }

  return applyDecorators(...decorators);
};

/**
 * Decorator untuk standard API response dengan NotFound error
 */
export const ApiStandardResponseWithNotFound = <
  DataDto extends Type<unknown> | null,
>(
  dataDto: DataDto,
  options?: Omit<ApiStandardResponseOptions, 'includeErrors'>,
) => {
  if (dataDto === null) {
    // For delete operations that return null
    return applyDecorators(
      ApiResponse({
        status: options?.status || HttpStatus.OK,
        description: options?.description || 'Resource deleted successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: {
              type: 'string',
              example: 'Resource deleted successfully',
            },
            data: { type: 'null', nullable: true },
            statusCode: { type: 'number', example: 200 },
          },
        },
      }),
      ApiNotFoundResponse({ description: 'Resource not found' }),
      ApiBadRequestResponse({ description: 'Bad request - validation failed' }),
      ApiInternalServerErrorResponse({ description: 'Internal server error' }),
    );
  }

  return applyDecorators(
    ApiStandardResponse(dataDto, {
      ...options,
      includeErrors: false,
    }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
    ApiBadRequestResponse({ description: 'Bad request - validation failed' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
};

/**
 * Auto-generate description based on status code
 */
function getDefaultDescription(status: number): string {
  const descriptions: Record<number, string> = {
    [HttpStatus.OK]: 'Operation successful',
    [HttpStatus.CREATED]: 'Resource created successfully',
    [HttpStatus.NO_CONTENT]: 'Resource deleted successfully',
  };
  return descriptions[status] || 'Success';
}
