import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UsersEntity } from 'src/users/users.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UsersEntity => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
