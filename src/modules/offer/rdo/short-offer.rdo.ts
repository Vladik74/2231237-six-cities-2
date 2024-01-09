import {Expose} from 'class-transformer';
import {HousingTypeEnum} from '../../../types/housing.type.enum.js';

export class OfferShortRdo {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    previewImage!: string;

  @Expose()
    premium!: boolean;

  @Expose()
    favorite!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingTypeEnum;

  @Expose()
    cost!: number;

  @Expose()
    commentsCount!: number;
}
