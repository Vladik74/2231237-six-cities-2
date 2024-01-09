import {inject, injectable} from 'inversify';
import {configSchema, ConfigSchema} from './config.schema.js';
import {ComponentEnum} from '../types/component.enum.js';
import {config} from 'dotenv';
import {ILogger} from '../loggers/iLogger.js';
import {Iconfig} from './iconfig.js';

@injectable()
export default class ConfigService implements Iconfig<ConfigSchema> {
  private readonly config: ConfigSchema;

  constructor(
    @inject(ComponentEnum.ILogger) private readonly logger: ILogger
  ) {
    const configOutput = config();

    if (configOutput.error) {
      throw new Error('Ошибка при чтении .env файла');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env файл успешно найден');
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
