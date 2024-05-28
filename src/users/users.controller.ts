import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { UsersService } from './users.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/get-user-decorator';
import { UsersEntity } from './users.entity';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiBody({
    type: RegisterRequestDto,
    examples: {
      'John Doe': {
        value: {
          username: 'John Doe',
        } as RegisterRequestDto,
      },
    },
  })
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.usersService.register(registerRequestDto);
  }

  @Post('login')
  @ApiBody({
    type: LoginRequestDto,
    examples: {
      'John Doe': {
        value: {
          username: 'John Doe',
        } as LoginRequestDto,
      },
    },
  })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.usersService.login(loginRequestDto);
  }

  @Post('logout')
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  async logout(@GetUser() user: UsersEntity) {
    return this.usersService.logout(user);
  }
}
