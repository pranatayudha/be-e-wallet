import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferRequestDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  to_username: string;

  @ApiProperty({
    type: Number,
    example: 1000000,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
