import {Container} from 'inversify';
import {ComponentEnum} from '../../types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {UserEntity, UserModel} from './user.entity.js';
import UserService from './user.service.js';
import {IUser} from './iUser.js';
import UserController from './user.controller.js';
import {Controller} from '../../controller/controller.abstract.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<IUser>(ComponentEnum.IUser).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(ComponentEnum.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(ComponentEnum.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
