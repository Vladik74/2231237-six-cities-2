import {UserTypeEnum} from './user.type.enum.js';


export type CommentType = {
  text: string;
  publicationDate: Date;
  rating: number;
  author: UserTypeEnum;
}
