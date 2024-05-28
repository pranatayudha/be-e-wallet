import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BalancesModule } from './balances/balances.module';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        // WARNING
        // Setting synchronize: true shouldn't be used in production
        // - otherwise you can lose production data.
        synchronize: false,
        dropSchema: false,
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(<string>configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        schema: configService.get('POSTGRES_SCHEMA'),
        logging: false,
      }),
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    AuthModule,
    BalancesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
