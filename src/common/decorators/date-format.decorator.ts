import { Transform } from 'class-transformer';
import { parseDateString, formatDateString } from '../utils/date.util';

/**
 * Transform date string from dd.mm.yyyy format to Date object
 * Use this decorator on DTO properties that receive date in dd.mm.yyyy format
 */
export function TransformDateFromString() {
  return Transform(({ value }): Date | null | string => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      const date = parseDateString(value);
      if (!date) {
        return value; // Return original value if parsing fails, validation will catch it
      }
      return date;
    }
    return value as string;
  });
}

/**
 * Transform Date object to dd.mm.yyyy format string
 * Use this decorator on DTO properties that should return date in dd.mm.yyyy format
 */
export function TransformDateToString() {
  return Transform(({ value }): string | null => {
    if (value === null || value === undefined) {
      return null;
    }
    if (value instanceof Date) {
      return formatDateString(value);
    }
    if (typeof value === 'string') {
      // If it's already a string, try to parse and format it
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatDateString(date);
      }
    }
    return null;
  });
}
