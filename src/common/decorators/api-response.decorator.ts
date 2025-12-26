import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import {
  ApiResponseDto,
  PaginatedApiResponseDto,
} from '../dto/api-response.dto';

export const ApiStandardResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  options?: {
    status?: number;
    description?: string;
    isArray?: boolean;
    isPaginated?: boolean;
  },
) => {
  const status = options?.status || 200;
  const description = options?.description || 'Success';
  const isArray = options?.isArray || false;
  const isPaginated = options?.isPaginated || false;

  if (isPaginated) {
    return applyDecorators(
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
  }

  if (isArray) {
    return applyDecorators(
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
  }

  return applyDecorators(
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
};
