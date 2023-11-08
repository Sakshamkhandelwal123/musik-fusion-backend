import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { applicationConfig } from 'config';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { UsersService } from 'src/users/users.service';
import { InvalidUserError } from 'src/utils/errors/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    let request: any;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const gqlCtx = GqlExecutionContext.create(context);
      request = gqlCtx.getContext().req;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: applicationConfig.jwt.secret,
      });

      const user = await this.usersService.findOne({
        id: payload.id,
      });

      if (!user) {
        throw new InvalidUserError();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
