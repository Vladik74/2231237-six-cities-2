import {ILogger} from '../loggers/iLogger.js';
import {inject, injectable} from 'inversify';
import {ExceptionFilter} from './exception.filter.js';
import {HttpError} from './http.errors.js';
import {NextFunction, Request, Response} from 'express';
import {ComponentEnum} from '../types/component.enum.js';
import {StatusCodes} from 'http-status-codes';
import {createErrorObject} from '../helpers/common.js';

@injectable()
export default class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(ComponentEnum.ILogger) private logger: ILogger
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
