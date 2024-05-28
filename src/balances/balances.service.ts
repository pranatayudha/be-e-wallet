import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { GetBalanceResponseDto } from './dtos/get-balance-response.dto';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getBalance(userData: UsersEntity): Promise<GetBalanceResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        username: userData.username,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('Username not found');
    }

    return {
      message: 'Success',
      data: {
        balance: +user.balance,
      },
      statusCode: HttpStatus.OK,
    };
  }
}
