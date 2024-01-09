import 'reflect-metadata';
import {Container} from 'inversify';
import Application from './app/application.js';
import {ComponentEnum} from './types/component.enum.js';
import {createApplicationContainer} from './app/application.container.js';
import {createUserContainer} from './modules/user/user.container.js';
import {createOfferContainer} from './modules/offer/offer.container.js';
import {createCommentContainer} from './modules/comment/comment.container.js';

const container = Container.merge(createApplicationContainer(),
  createUserContainer(),
  createOfferContainer(),
  createCommentContainer());

const application = container.get<Application>(ComponentEnum.Application);
await application.init();
