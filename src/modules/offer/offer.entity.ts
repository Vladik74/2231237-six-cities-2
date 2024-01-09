import typegoose, {defaultClasses, getModelForClass, Ref, Severity} from '@typegoose/typegoose';
import {CityEnum} from '../../types/city.enum.js';
import {AmenitiesEnum} from '../../types/amenities.enum.js';
import {HousingTypeEnum} from '../../types/housing.type.enum.js';
import {CoordinatesType} from '../../types/coords.js';
import {UserEntity} from '../user/user.entity.js';
import mongoose from 'mongoose';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({
    required: true,
    type: () => String,
    enum: CityEnum
  })
  public city!: CityEnum;

  @prop({default: 0, type: () => Number})
  public commentsCount!: number;

  @prop({
    required: true,
    min: [100, 'Min cost is 100'],
    max: [100000, 'Max cost is 100000'],
    type: () => Number
  })
  public cost!: number;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024'],
    trim: true,
    type: () => String
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: AmenitiesEnum
  })
  public amenities!: AmenitiesEnum[];

  @prop({
    required: true, min: [1, 'Min length for username is 1'],
    max: [10, 'Max length for username is 10'],
    type: () => Number
  })
  public guestCount!: number;

  @prop({
    required: true,
    type: () => String,
    minCount: [6, 'Images should be 6'],
    maxCount: [6, 'Images should be 6'],
    enum: HousingTypeEnum
  })
  public housingType!: HousingTypeEnum;

  @prop({
    type: () => [String], minCount: [6, 'Images amount should be 6'],
    maxCount: [6, 'Images amount should be 6']
  })
  public images!: string[];

  @prop({
    required: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for username is 100'],
    trim: true,
    type: String
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true, default: false, type: () => Boolean})
  public premium!: boolean;

  @prop({type: () => String, default: ''})
  public previewImage!: string;

  @prop({type: () => Date})
  public publicationDate!: Date;

  @prop({
    required: true, min: [1, 'Min length for rating is 1'],
    max: [5, 'Max length for rating is 5'],
    default: 1,
    type: () => Number
  })
  public rating!: number;

  @prop({
    required: true, min: [1, 'Min length for room count is 1'],
    max: [8, 'Max length for room count is 8'],
    type: () => Number
  })
  public roomCount!: number;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW,
    type: () => mongoose.Schema.Types.Mixed
  })
  public coords!: CoordinatesType;
}

export const OfferModel = getModelForClass(OfferEntity);
