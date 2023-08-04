import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  statusId: number;
}
