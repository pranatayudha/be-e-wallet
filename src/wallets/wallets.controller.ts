import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersEntity } from 'src/entities/users.entity';
import { GetBalanceResponseDto } from './dtos/get-balance-response.dto';
import { GetTransactionHistoryResponseDto } from './dtos/get-transaction-history-response.dto';
import { TopUpBalanceRequestDto } from './dtos/top-up-balance-request.dto';
import { TopUpBalanceResponseDto } from './dtos/top-up-balance-response.dto';
import { TransferRequestDto } from './dtos/transfer-request-dto';
import { TransferResponseDto } from './dtos/transfer-response-dto';
import { WalletsService } from './wallets.service';

@ApiTags('Wallets')
@ApiBearerAuth('Authorization')
@Controller()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance')
  async getBalance(
    @GetUser() user: UsersEntity,
  ): Promise<GetBalanceResponseDto> {
    return this.walletsService.getBalance(user);
  }

  @Get('transaction-history')
  async getTransactionHistory(
    @GetUser() user: UsersEntity,
  ): Promise<GetTransactionHistoryResponseDto> {
    return this.walletsService.getTransactionHistory(user);
  }

  @Post('transfer')
  async transfer(
    @Body() transferRequestDto: TransferRequestDto,
    @GetUser() user: UsersEntity,
  ): Promise<TransferResponseDto> {
    return this.walletsService.transfer(transferRequestDto, user);
  }

  @Post('topup')
  async topUpBalance(
    @Body() topUpBalanceRequestDto: TopUpBalanceRequestDto,
    @GetUser() user: UsersEntity,
  ): Promise<TopUpBalanceResponseDto> {
    return this.walletsService.topUpBalance(topUpBalanceRequestDto, user);
  }
}
