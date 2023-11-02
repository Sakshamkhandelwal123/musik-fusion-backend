import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (executionContext: string, context: ExecutionContext) => {
    let req: any;

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      req = ctx.getContext().req;
    }

    const authorization = req.headers.authorization;

    if (authorization && authorization.split(' ').length !== 2) return null;

    if (!authorization) return null;

    return authorization.split(' ')[1];
  },
);
