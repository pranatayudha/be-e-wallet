import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersEntity } from 'src/entities/users.entity';
import { WalletsService } from './wallets.service';

@ApiTags('Wallets')
@ApiBearerAuth('Authorization')
@Controller()
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance')
  async getBalance(@GetUser() user: UsersEntity) {
    return this.walletsService.getBalance(user);
  }
}
