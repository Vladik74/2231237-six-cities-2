import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './comment.entity.js';
import CommentService from './comment.service.js';
import {ComponentEnum} from '../../types/component.enum.js';
import {IComment} from './IComment.js';
import {IController} from '../../controller/IController.js';
import CommentController from './comment.controller.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<IComment>(ComponentEnum.IComment).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(ComponentEnum.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<IController>(ComponentEnum.CommentController)
    .to(CommentController).inSingletonScope();
  return commentContainer;
}
