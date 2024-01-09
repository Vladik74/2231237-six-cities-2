import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserTypeEnum} from '../../types/user.type.enum.js';
import {User} from '../../types/user.js';
import {createSHA256} from '../../helpers/common.js';
import {OfferEntity} from '../offer/offer.entity.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true, type: () => String})
  public email: string;

  @prop({required: false, default: '', match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png'], type: () => String})
  public avatar?: string;

  @prop({
    required: true,
    minlength: [1, 'Min length for username is 1'],
    maxlength: [15, 'Max length for username is 15'],
    type: () => String
  })
  public username: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserTypeEnum
  })
  public type: UserTypeEnum;

  @prop({
    required: true,
    type: () => String
  })
  private password?: string;

  @prop({
    required: true,
    ref: 'OfferEntity',
    default: []
  })
  public favorite!: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.username = userData.username;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public checkPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
