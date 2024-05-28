import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { UsersEntity } from './users.entity';

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

    if (!user) {
      await this.usersRepository.insert({ username: payload.username });
    } else {
      throw new ConflictException('Username already exists');
    }

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
}
