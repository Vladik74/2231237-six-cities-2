import {inject, injectable} from 'inversify';
import {Controller} from '../../controller/controller.abstract.js';
import {ILogger} from '../../loggers/iLogger.js';
import {ComponentEnum} from '../../types/component.enum.js';
import {IOffer} from './IOffer.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import {fillDto} from '../../helpers/common.js';
import CreateOffer from './create-offer.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {UpdateOffer} from './update-offer.js';
import {IUser} from '../user/iUser.js';
import {IComment} from '../comment/IComment.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';
import {ParamsCity, ParamsOffer, ParamsOffersCount} from '../../types/params.type.js';
import {ShortFavoriteOfferDto} from './rdo/short-favorite-offer.dto.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {Iconfig} from '../../config/iconfig.js';
import {ConfigSchema} from '../../config/config.schema.js';
import {UploadMiddleware} from '../../middlewares/upload.middleware.js';
import {OfferShortRdo} from './rdo/short-offer.rdo.js';
import {RequestBody, RequestParams} from '../../http-handlers/request.js';
import {HttpError} from '../../http-handlers/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import UploadImageResponse from './rdo/upload-offer-image-res.js';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(ComponentEnum.ILogger) logger: ILogger,
    @inject(ComponentEnum.IOffer) private readonly offerService: IOffer,
    @inject(ComponentEnum.IUser) private readonly userService: IUser,
    @inject(ComponentEnum.IComment) private readonly commentService: IComment,
    @inject(ComponentEnum.IConfig) configService: Iconfig<ConfigSchema>
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOffer)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOffer),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });

    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: 'users/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:offerId/preview-image',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadMiddleware(this.configService.get('UPLOAD_DIR'), 'previewImage'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadMiddleware(this.configService.get('UPLOAD_DIR'), 'image'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Delete,
      handler: this.deleteImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadMiddleware(this.configService.get('UPLOAD_DIR'), 'image'),
      ]
    });
  }

  public async index({params}: Request<ParamsOffersCount>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, fillDto(OfferShortRdo, offers));
  }

  public async create({body, user}: Request<RequestParams, RequestBody, CreateOffer>, res: Response): Promise<void> {
    const result = await this.offerService.create({...body, userId: user.id});
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDto(OfferRdo, offer));
  }

  public async show({params}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDto(OfferRdo, offer));
  }

  public async update({params, body, user}: Request<ParamsOffer, unknown, UpdateOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created by other user',
        'UpdateOffer');
    }
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDto(OfferRdo, updatedOffer));
  }

  public async delete({params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was deleted',
        'DeleteOffer');
    }
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Offer ${params.offerId} was removed.`);
  }

  public async uploadPreviewImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'uploadPreviewImage');
    }
    const {offerId} = req.params;
    const updateDto = {previewImage: req.file?.filename};
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDto(UploadImageResponse, {updateDto}));
  }

  public async uploadImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'uploadImage');
    }
    const {offerId} = req.params;
    await this.offerService.addImage(offerId, req.file?.filename);
    this.noContent(res, 'Image was added');
  }

  public async deleteImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'deleteImage');
    }
    const {offerId} = req.params;
    await this.offerService.deleteImage(offerId, req.file?.filename);
    this.noContent(res, 'Image was deleted');
  }

  public async showPremium({params}: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDto(OfferShortRdo, offers));
  }

  public async showFavorites(req: Request, _res: Response): Promise<void> {
    const {user} = req;
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, fillDto(ShortFavoriteOfferDto, offers));
  }

  public async addFavorite({params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }
}
