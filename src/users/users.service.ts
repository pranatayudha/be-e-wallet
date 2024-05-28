import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async logout(userData: UsersEntity): Promise<LogoutResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        username: userData.username,
        isLogin: userData.isLogin,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('Username not logged in');
    }

    await this.usersRepository.update(
      { username: userData.username, isLogin: userData.isLogin },
      { isLogin: false },
    );

    return {
      message: 'Success',
      statusCode: HttpStatus.OK,
    };
  }
}
