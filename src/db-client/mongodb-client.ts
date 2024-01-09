import {IDbClient} from './iDb-client.js';
import mongoose, {Mongoose} from 'mongoose';
import {inject, injectable} from 'inversify';
import {ComponentEnum} from '../types/component.enum.js';
import {ILogger} from '../loggers/iLogger.js';
import {setTimeout} from 'node:timers/promises';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 10000;

@injectable()
export default class MongoClientService implements IDbClient {
  private isConnected = false;
  private mongooseInstance: Mongoose | null = null;

  constructor(
    @inject(ComponentEnum.ILogger) private readonly logger: ILogger
  ) {
  }

  private async _connectWithRetry(uri: string): Promise<Mongoose> {
    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.logger.info(uri);
        return await mongoose.connect(uri);
      } catch (error) {
        attempt++;
        this.logger.error(`Ошибка при подключении к бд. Попытка ${error}`);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    this.logger.error(`Не получилось установить соединение с бд. Ошибка: ${attempt}`);
    throw new Error('Ошибка при подключении к бд');
  }

  private async _connect(uri: string): Promise<void> {
    this.mongooseInstance = await this._connectWithRetry(uri);
    this.isConnected = true;
  }

  private async _disconnect(): Promise<void> {
    await this.mongooseInstance?.disconnect();
    this.isConnected = false;
    this.mongooseInstance = null;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB клиент уже инициализирован');
    }

    this.logger.info('Попытка подключения к MongoDB');
    await this._connect(uri);
    this.logger.info(uri);
    this.logger.info('Соединение с MongoDB установлено');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Нет соединения с бд');
    }

    await this._disconnect();
    this.logger.info('Соединение с бд закрыто');
  }
}
