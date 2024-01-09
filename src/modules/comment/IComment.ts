import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import CreateComment from './create-comment.js';

export interface IComment {
  createForOffer(dto: CreateComment): Promise<DocumentType<CommentEntity>>;

  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;

  deleteByOfferId(offerId: string): Promise<number | null>;

  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>
}
