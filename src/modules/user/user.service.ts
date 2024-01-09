import {IUser} from './iUser.js';
import {inject, injectable} from 'inversify';
import {ILogger} from '../../loggers/iLogger.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import CreateUser from './create-user.js';
import {ComponentEnum} from '../../types/component.enum.js';
import {OfferEntity} from '../offer/offer.entity.js';
import LoginUser from './login-user.js';
import {DEFAULT_AVATAR} from '../../types/consts.js';
import UpdateUser from './update-user.js';

@injectable()
export default class UserService implements IUser {

  constructor(
    @inject(ComponentEnum.ILogger) private readonly logger: ILogger,
    @inject(ComponentEnum.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(ComponentEnum.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async create(dto: CreateUser, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`Новый пользователь создан: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.offerModel
      .find({_id: {$in: offers.favorite}})
      .populate('userId');
  }

  public async findOrCreate(dto: CreateUser, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async authUser(dto: LoginUser, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.checkPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({'_id': userId});
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $addToSet: { favorite: offerId } }
    );
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $pull: { favorite: offerId } }
    );
  }

  public async updateById(userId: string, dto: UpdateUser): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
