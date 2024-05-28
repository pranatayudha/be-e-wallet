import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { TransactionsEntity } from 'src/entities/transactions.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { GetBalanceResponseDto } from './dtos/get-balance-response.dto';
import { GetTransactionHistoryResponseDto } from './dtos/get-transaction-history-response.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
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

  async getTransactionHistory(
    userData: UsersEntity,
  ): Promise<GetTransactionHistoryResponseDto> {
    const transactionQuery = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .innerJoin('users', 'user', 'user.id = transaction.userId')
      .where('transaction.userId = :userId', { userId: userData.id })
      .andWhere('transaction.delFlag = :delFlag', { delFlag: false })
      .select([
        'transaction.description',
        'transaction.amount',
        'transaction.createdAt',
      ])
      .getRawMany();

    const transactionData = await Promise.all(
      transactionQuery.map(async (item) => {
        return {
          description: item.transaction_description,
          amount: +item.transaction_amount,
          created_at: moment(item.transaction_createdAt)
            .tz('Asia/Jakarta')
            .format('DD MMM YYYY HH:mm:ss'),
        };
      }),
    );

    return {
      message: 'Success',
      data: transactionData,
      statusCode: HttpStatus.OK,
    };
  }
}
