import { IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit: number;
}
