import {DocumentType} from '@typegoose/typegoose';
import CreateOffer from './create-offer.js';
import {OfferEntity} from './offer.entity.js';
import {UpdateOffer} from './update-offer.js';
import {DocumentExistsInterface} from '../../types/document.exists.js';

export interface IOffer extends DocumentExistsInterface {
  create(dto: CreateOffer): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerId: string, dto: UpdateOffer): Promise<DocumentType<OfferEntity> | null>;

  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;

  incrementComment(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  exists(documentId: string): Promise<boolean>;

  updateRating(offerId: string, rating: number): Promise<void>;

  addImage(offerId: string, image?: string): Promise<void>;

  deleteImage(offerId: string, image?: string): Promise<void>;
}
