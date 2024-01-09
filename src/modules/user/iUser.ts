import {DocumentType} from '@typegoose/typegoose';
import CreateUser from './create-user.js';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';
import LoginUser from './login-user.js';
import UpdateUser from './update-user.js';

export interface IUser {
  create(dto: CreateUser, salt: string): Promise<DocumentType<UserEntity>>;

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUser, salt: string): Promise<DocumentType<UserEntity>>;

  findById(userId: string): Promise<DocumentType<UserEntity> | null>;

  updateById(userId: string, dto: UpdateUser): Promise<DocumentType<UserEntity> | null>;

  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;

  addToFavoritesById(userId: string, offerId: string): Promise<void>;

  removeFromFavoritesById(userId: string, offerId: string): Promise<void>;

  authUser(dto: LoginUser, salt: string): Promise<DocumentType<UserEntity> | null>;
}
