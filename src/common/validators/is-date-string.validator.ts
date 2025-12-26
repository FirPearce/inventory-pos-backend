import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isValidDateString } from '../utils/date.util';

/**
 * Validates if the value is a valid date in dd.mm.yyyy format
 */
export function IsDateString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined || value === '') {
            return true; // Let @IsOptional handle null/undefined
          }
          if (typeof value !== 'string') {
            return false;
          }
          return isValidDateString(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in dd.mm.yyyy format`;
        },
      },
    });
  };
}
