import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersEntity } from 'src/users/users.entity';
import { BalancesService } from './balances.service';

@ApiTags('Balances')
@Controller('balance')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  async getBalance(@GetUser() user: UsersEntity) {
    return this.balancesService.getBalance(user);
  }
}
