import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from 'src/entities/transactions.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule,
    JwtModule.register({
      secret: 'be-e-wallet',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UsersEntity, TransactionsEntity]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
