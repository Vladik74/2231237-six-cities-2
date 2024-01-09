import {ILogger} from '../loggers/iLogger.js';
import {Response, Router} from 'express';
import {injectable} from 'inversify';
import {IController} from './IController.js';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';
import {IRoute} from '../types/route.type.js';
import {ConfigSchema} from '../config/config.schema.js';
import {getFullServerPath, transformObject} from '../helpers/common.js';
import {STATIC_FIELDS} from '../types/consts.js';
import {Iconfig} from '../config/iconfig.js';

@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(protected readonly logger: ILogger, protected readonly configService: Iconfig<ConfigSchema>) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
  }

  protected addStaticPath(data: Record<string, unknown>): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIR_PATH')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIR')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as Record<string, unknown>);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
