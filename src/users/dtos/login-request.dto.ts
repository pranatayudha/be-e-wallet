import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
