import {IMiddleware} from './iMiddleware.js';
import {NextFunction, Request, Response} from 'express';
import {HttpError} from '../http-handlers/http.errors.js';
import {StatusCodes} from 'http-status-codes';

export class PrivateRouteMiddleware implements IMiddleware {
  public async execute({ user }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (! user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
