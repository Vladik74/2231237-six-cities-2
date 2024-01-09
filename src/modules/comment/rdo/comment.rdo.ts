import {Expose, Type} from 'class-transformer';
import UserRdo from '../../user/rdo/user.rdo.js';
import {UserTypeEnum} from '../../../types/user.type.enum.js';

export default class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt'})
  public postDate!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user!: UserTypeEnum;
}
