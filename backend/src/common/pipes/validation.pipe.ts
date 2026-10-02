import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    // whitelist remove campos não declarados no DTO (ex.: professorId enviado pelo cliente)
    const errors = await validate(object, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        message: this.flatten(errors),
        error: 'Validation Error',
      });
    }

    return object;
  }

  private flatten(errors: ValidationError[], parent = ''): string[] {
    return errors.flatMap((err) => {
      const path = parent ? `${parent}.${err.property}` : err.property;
      const own = Object.values(err.constraints || {}).map((msg) =>
        parent ? `${path}: ${msg}` : msg,
      );
      return [...own, ...this.flatten(err.children || [], path)];
    });
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
