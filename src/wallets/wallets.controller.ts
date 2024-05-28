import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersEntity } from 'src/entities/users.entity';
import { GetBalanceResponseDto } from './dtos/get-balance-response.dto';
import { WalletsService } from './wallets.service';
import { GetTransactionHistoryResponseDto } from './dtos/get-transaction-history-response.dto';

@ApiTags('Wallets')
@ApiBearerAuth('Authorization')
@Controller()
@UseGuards(JwtAuthGuard)
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
}
