import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopUpBalanceRequestDto {
  @ApiProperty({
    type: Number,
    example: 1000000,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
