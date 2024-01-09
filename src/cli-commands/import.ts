import chalk from 'chalk';
import {CliCommandInterface} from './cli-command.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import {getConnectionString, getErrorMessage} from '../helpers/common.js';
import {createNewOffer} from '../helpers/offer.js';
import {IUser} from '../modules/user/iUser.js';
import {IOffer} from '../modules/offer/IOffer.js';
import {IDbClient} from '../db-client/iDb-client.js';
import {ILogger} from '../loggers/iLogger.js';
import OfferService from '../modules/offer/offer.service.js';
import {OfferModel} from '../modules/offer/offer.entity.js';
import UserService from '../modules/user/user.service.js';
import {UserModel} from '../modules/user/user.entity.js';
import MongoClientService from '../db-client/mongodb-client.js';
import ConsoleLogger from '../loggers/console.logger.js';
import {OfferType} from '../types/offer.type.js';
import {DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD} from '../types/consts.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: IUser;
  private offerService!: IOffer;
  private databaseService!: IDbClient;
  private readonly logger: ILogger;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel, OfferModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: OfferType) {
    const user = await this.userService.findOrCreate({
      ...offer.offerAuthor,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      ...offer,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: VoidFunction) {
    const offer = createNewOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} строк импортировано`);
    this.databaseService.disconnect();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getConnectionString(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('row', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      this.logger.error(`${chalk.redBright(`Can't read the file with error: ${getErrorMessage(err)}`)}`);
    }
  }
}
