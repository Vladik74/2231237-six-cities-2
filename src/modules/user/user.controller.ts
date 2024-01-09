import {Controller} from '../../controller/controller.abstract.js';
import {inject, injectable} from 'inversify';
import {ComponentEnum} from '../../types/component.enum.js';
import {ILogger} from '../../loggers/iLogger.js';
import {ConfigSchema} from '../../config/config.schema.js';
import {Iconfig} from '../../config/iconfig.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {HttpError} from '../../http-handlers/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import CreateUser from './create-user.js';
import {IUser} from './iUser.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate.middleware.js';
import LoginUser from './login-user.js';
import {CreateUserRequest} from '../../types/create-user-req.js';
import UserRdo from './rdo/user.rdo.js';
import {createJWT, fillDto} from '../../helpers/common.js';
import {LoginUserRequest} from '../../types/login-user-req.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {UploadMiddleware} from '../../middlewares/upload.middleware.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {JWT_CRYPT_ALGORITHM} from '../../types/consts.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import {BLACK_LIST_TOKENS} from '../../middlewares/auth.middleware.js';
import UploadUserAvatarResponse from './rdo/update-user-avatar.rdo.js';

@injectable()
export default class UserController extends Controller {
  constructor(@inject(ComponentEnum.ILogger) logger: ILogger,
    @inject(ComponentEnum.IUser) private readonly userService: IUser,
    @inject(ComponentEnum.IConfig) protected readonly configService: Iconfig<ConfigSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUser)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuth,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUser)
      ]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadUserAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadMiddleware(this.configService.get('UPLOAD_DIR'), 'avatar'),
      ]
    });
  }

  public async create({body}: CreateUserRequest, res: Response,): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDto(UserRdo, result)
    );
  }

  public async login({body}: LoginUserRequest, _res: Response,): Promise<void> {
    const user = await this
      .userService
      .authUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }
    const token = await createJWT(
      JWT_CRYPT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );
    this.ok(_res, {
      ...fillDto(LoggedUserRdo, user), token
    });
  }

  public async logout(req: Request, _res: Response): Promise<void> {
    const [, token] = String(req.headers.authorization?.split(' '));

    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    BLACK_LIST_TOKENS.add(token);

    this.noContent(_res, {token});
  }

  public async checkAuth({user: {email}}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDto(LoggedUserRdo, foundedUser));
  }

  public async uploadUserAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDto(UploadUserAvatarResponse, uploadFile));
  }
}
