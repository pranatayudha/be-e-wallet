import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { TransactionsEntity } from 'src/entities/transactions.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { GetBalanceResponseDto } from './dtos/get-balance-response.dto';
import { GetTransactionHistoryResponseDto } from './dtos/get-transaction-history-response.dto';
import { TransferRequestDto } from './dtos/transfer-request-dto';
import { TransferResponseDto } from './dtos/transfer-response-dto';
import { TransactionType } from 'src/utils/enums/TransactionType';

@Injectable()
export class WalletsService {
  constructor(
    private dataSource: DataSource,
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

  async transfer(
    payload: TransferRequestDto,
    userData: UsersEntity,
  ): Promise<TransferResponseDto> {
    const destinationUserData = await this.usersRepository.findOne({
      where: {
        username: payload.to_username,
      },
    });

    if (!destinationUserData) {
      throw new NotFoundException('Destination user not found');
    }

    const loggedInUserData = await this.usersRepository.findOne({
      where: {
        username: userData.username,
      },
    });

    if (+loggedInUserData.balance < +payload.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(TransactionsEntity, {
        userId: userData.id,
        description: `Transfer to ${payload.to_username}`,
        amount: -payload.amount,
        type: TransactionType.TRANSFER,
      });

      await queryRunner.manager.update(
        UsersEntity,
        {
          id: userData.id,
          username: userData.username,
          delFlag: false,
        },
        {
          balance: +loggedInUserData.balance - +payload.amount,
        },
      );

      await queryRunner.manager.insert(TransactionsEntity, {
        userId: destinationUserData.id,
        description: `Receive money from ${userData.username}`,
        amount: payload.amount,
        type: TransactionType.RECEIVE,
      });

      await queryRunner.manager.update(
        UsersEntity,
        {
          id: destinationUserData.id,
          username: destinationUserData.username,
          delFlag: false,
        },
        {
          balance: +destinationUserData.balance + +payload.amount,
        },
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return {
      message: 'Success',
      statusCode: HttpStatus.OK,
    };
  }
}
