import {UserTypeEnum} from './user.type.enum.js';

export type User = {
  username: string;
  email: string;
  avatar?: string;
  type : UserTypeEnum;
}
