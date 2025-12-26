import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../interfaces/api-response.interface';

interface PaginatedData {
  data: unknown[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | PaginatedApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode || HttpStatus.OK;

    // Skip transformation for streaming responses or if response is already sent
    if (response.headersSent) {
      return next.handle() as Observable<
        ApiResponse<T> | PaginatedApiResponse<T>
      >;
    }

    return next.handle().pipe(
      map((data: unknown) => {
        // Skip if response is already in standard format (from exception filter)
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data
        ) {
          return data as ApiResponse<T> | PaginatedApiResponse<T>;
        }

        // Check if data is paginated response
        const paginatedData = data as PaginatedData;
        if (
          paginatedData &&
          typeof paginatedData === 'object' &&
          'meta' in paginatedData &&
          'data' in paginatedData &&
          Array.isArray(paginatedData.data)
        ) {
          return {
            success: true,
            message: this.getSuccessMessage(context, statusCode),
            data: paginatedData.data as T[],
            meta: paginatedData.meta,
            statusCode,
          } as PaginatedApiResponse<T>;
        }

        // Standard success response
        return {
          success: true,
          message: this.getSuccessMessage(context, statusCode),
          data: (data !== undefined ? data : null) as T,
          statusCode,
        } as ApiResponse<T>;
      }),
    );
  }

  private getSuccessMessage(
    context: ExecutionContext,
    statusCode: number,
  ): string {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    const messages: Record<string, string> = {
      GET: 'Data retrieved successfully',
      POST: 'Resource created successfully',
      PATCH: 'Resource updated successfully',
      PUT: 'Resource updated successfully',
      DELETE: 'Resource deleted successfully',
    };

    if (statusCode === Number(HttpStatus.CREATED)) {
      return 'Resource created successfully';
    }

    if (statusCode === Number(HttpStatus.NO_CONTENT)) {
      return 'Resource deleted successfully';
    }

    return messages[method] || 'Operation successful';
  }
}
