import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {ILogger} from '../../loggers/iLogger.js';
import {IComment} from './IComment.js';
import {IOffer} from '../offer/IOffer.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import CreateComment from './create-comment.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate.middleware.js';
import {ComponentEnum} from '../../types/component.enum.js';
import {fillDto} from '../../helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {ParamsOffer} from '../../types/params.type.js';
import {ConfigSchema} from '../../config/config.schema.js';
import {Iconfig} from '../../config/iconfig.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(ComponentEnum.ILogger) protected readonly logger: ILogger,
    @inject(ComponentEnum.IComment) private readonly commentService: IComment,
    @inject(ComponentEnum.IOffer) private readonly offerService: IOffer,
    @inject(ComponentEnum.IConfig) configService: Iconfig<ConfigSchema>
  ) {
    super(logger, configService);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateComment),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index({params}: Request<ParamsOffer>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDto(CommentRdo, comments));
  }

  public async create({body, params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer({
      ...body,
      offerId: params.offerId,
      userId: user.id
    });
    const result = await this.commentService.findById(comment.id);
    this.created(res, fillDto(CommentRdo, result));
  }
}
