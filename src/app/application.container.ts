import {Container} from 'inversify';
import Application from './application.js';
import {ComponentEnum} from '../types/component.enum.js';
import LoggerService from '../loggers/logger.js';
import {ConfigSchema} from '../config/config.schema.js';
import {ILogger} from '../loggers/iLogger.js';
import {Iconfig} from '../config/iconfig.js';
import ConfigService from '../config/config.service.js';
import MongoClientService from '../db-client/mongodb-client.js';
import {IDbClient} from '../db-client/iDb-client.js';
import {ExceptionFilter} from '../http-handlers/exception.filter.js';
import AppExceptionFilter from '../http-handlers/app-exception.filter.js';

export function createApplicationContainer() {
  const applicationContainer = new Container();
  applicationContainer.bind<Application>(ComponentEnum.Application).to(Application).inSingletonScope();
  applicationContainer.bind<ILogger>(ComponentEnum.ILogger).to(LoggerService).inSingletonScope();
  applicationContainer.bind<Iconfig<ConfigSchema>>(ComponentEnum.IConfig).to(ConfigService).inSingletonScope();
  applicationContainer.bind<IDbClient>(ComponentEnum.IDbClient).to(MongoClientService).inSingletonScope();
  applicationContainer.bind<ExceptionFilter>(ComponentEnum.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  return applicationContainer;
}
