import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {ILogger} from '../loggers/iLogger.js';
import {ComponentEnum} from '../types/component.enum.js';
import {ConfigSchema} from '../config/config.schema.js';
import {Iconfig} from '../config/iconfig.js';
import express, {Express} from 'express';
import {IDbClient} from '../db-client/iDb-client.js';
import {ExceptionFilter} from '../http-handlers/exception.filter.js';
import {IController} from '../controller/IController.js';
import {getConnectionString} from '../helpers/common.js';
import {AuthMiddleware} from '../middlewares/auth.middleware.js';


@injectable()
export default class Application {
  private server: Express;

  constructor(
    @inject(ComponentEnum.ILogger) private readonly logger: ILogger,
    @inject(ComponentEnum.IConfig) private readonly config: Iconfig<ConfigSchema>,
    @inject(ComponentEnum.IDbClient) private readonly databaseClient: IDbClient,
    @inject(ComponentEnum.OfferController) private readonly offerController: IController,
    @inject(ComponentEnum.CommentController) private readonly commentController: IController,
    @inject(ComponentEnum.UserController) private userController: IController,
    @inject(ComponentEnum.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getConnectionString(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    this.logger.info('Сервер инициализируется');

    const port = this.config.get('PORT');
    this.server.listen(port);

    this.logger.info(`Сервер успешно стартовал на http://localhost:${this.config.get('PORT')}`);
  }

  private async _initRoutes() {
    this.logger.info('Контроллеры инициализируются');
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
    this.logger.info('Контроллеры успешно инициализированы');
  }

  private async _initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async _initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIR'))
    );
    this.server.use(
      '/static',
      express.static(this.config.get('STATIC_DIR_PATH'))
    );
    const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(authMiddleware.execute.bind(authMiddleware));
    this.logger.info('Миддлвары инициализированы');
  }

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info(`DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`SALT: ${this.config.get('SALT')}`);

    this.logger.info('База данных инициализируется');
    await this._initDb();
    this.logger.info('База данных инициализирована');

    await this._initMiddleware();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
    this.logger.info(`Сервер запущен по адресу http://localhost:${this.config.get('PORT')}`);
  }
}
