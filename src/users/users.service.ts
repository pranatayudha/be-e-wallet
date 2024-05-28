import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { UsersEntity } from './users.entity';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getUser(payload: any): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      where: {
        username: payload.username,
      },
    });
  }

  async register(payload: RegisterRequestDto): Promise<RegisterResponseDto> {
    let user = await this.usersRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (user) {
      throw new ConflictException('Username already exists');
    }

    await this.usersRepository.insert({ username: payload.username });

    let jwtSignPayload = {
      username: payload.username,
      isLogin: true,
    };

    const accessToken = this.jwtService.sign(jwtSignPayload, {
      expiresIn: '1h',
      secret: 'be-e-wallet',
    });

    return {
      message: 'Success',
      data: {
        token: accessToken,
      },
      statusCode: HttpStatus.CREATED,
    };
  }

  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        username: payload.username,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('Username not found');
    }

    if (user.isLogin) {
      throw new ConflictException('Username is logged in');
    }

    await this.usersRepository.update(
      { username: user.username, isLogin: false },
      { isLogin: true },
    );

    let jwtSignPayload = {
      username: user.username,
      isLogin: true,
    };

    const accessToken = this.jwtService.sign(jwtSignPayload, {
      expiresIn: '1h',
      secret: 'be-e-wallet',
    });

    return {
      message: 'Success',
      data: {
        token: accessToken,
      },
      statusCode: HttpStatus.OK,
    };
  }
}
