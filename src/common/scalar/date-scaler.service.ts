import { Kind, ValueNode } from 'graphql';
import { Scalar, CustomScalar } from '@nestjs/graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): number {
    return value.getTime(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (Kind.INT === ast.kind || Kind.STRING === ast.kind) {
      return new Date(ast.value);
    }

    return null;
  }
}
