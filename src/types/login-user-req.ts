import {Request} from 'express';
import {RequestBody, RequestParams} from '../http-handlers/request.js';
import LoginUser from '../modules/user/login-user.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUser>;
