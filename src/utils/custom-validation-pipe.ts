import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      await getConstraint(errors);
      const firstErrorMessage = Object.values(tempGetConstraint)[0];
      throw new BadRequestException(firstErrorMessage);
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}

let tempGetConstraint: any;
let countHandlePosibilityInfinity: number;

const getConstraint = async (obj: any) => {
  if (obj[0].children.length > 0) {
    ++countHandlePosibilityInfinity;
    await getConstraint(obj[0].children);
  } else if (obj[0].children.length === 0) {
    tempGetConstraint = obj[0].constraints;

    return;
  }

  if (countHandlePosibilityInfinity === 10) {
    return;
  }
};
