import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  statusId: number;
}
