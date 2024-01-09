import {Request} from 'express';
import {RequestBody, RequestParams} from '../http-handlers/request.js';
import CreateUser from '../modules/user/create-user.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUser>;
