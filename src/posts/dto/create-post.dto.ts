import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isArrayNumber' })
export class isArrayNumber implements ValidatorConstraintInterface {
  validate(numbers: number[]): boolean {
    if (typeof numbers === 'number') {
      return false;
    }

    if (numbers) {
      return numbers.every((number) => !Number.isNaN(number));
    }
    return false;
  }
}

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @Validate(isArrayNumber, { message: 'Tags Array value must a number' })
  tagIds: number[];
}
