import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {CommentEntity} from './comment.entity.js';
import {IOffer} from '../offer/IOffer.js';
import {IComment} from './IComment.js';
import {ComponentEnum} from '../../types/component.enum.js';
import CreateComment from './create-comment.js';
import {SortType} from '../../types/sort.type.js';

const COMMENTS_COUNT = 50;
@injectable()
export default class CommentService implements IComment {
  constructor(
    @inject(ComponentEnum.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(ComponentEnum.OfferModel) private readonly offerService: IOffer
  ) {
  }

  public async createForOffer(dto: CreateComment): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incrementComment(offerId);

    const offer = await this.offerService.findById(offerId);
    const count = offer?.commentsCount ?? 1;
    const rating = offer?.rating ?? 0;
    const updatedRating = (rating + dto.rating) / count;
    await this.offerService.updateRating(offerId, updatedRating);
    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SortType.Down})
      .populate('userId')
      .limit(COMMENTS_COUNT)
      .exec();
  }

  public findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
