import {Request} from 'express';
import {RequestBody, RequestParams} from '../http-handlers/request.js';
import CreateOffer from '../modules/offer/create-offer.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOffer>;
