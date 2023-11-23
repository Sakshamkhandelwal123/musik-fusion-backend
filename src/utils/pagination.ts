import { HttpException, HttpStatus } from '@nestjs/common';

import { getErrorCodeAndMessage } from './helpers';

export async function paginationQuery(
  model: any,
  offset = 0,
  limit = 10,
  search: any = {},
  order: any = [],
) {
  try {
    let options = {
      offset,
      limit,
    };

    if (Object.keys(search).length) {
      options = { ...options, ...search };
    }

    if (order && order.length) {
      options['order'] = order;
    }

    const { count, rows = [] } = await model.findAndCountAll(options);

    return {
      total: count,
      limit: limit,
      offset: offset,
      data: rows,
    };
  } catch (error) {
    throw new HttpException(
      getErrorCodeAndMessage(error),
      HttpStatus.BAD_REQUEST,
    );
  }
}
