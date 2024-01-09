import {Expose} from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HousingTypeEnum} from '../../../types/housing.type.enum.js';

export class ShortFavoriteOfferDto {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose()
    description!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

  @Expose()
    premium!: boolean;

  favorite = true;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingTypeEnum;

  @Expose()
    cost!: number;

  @Expose()
    commentsCount!: number;
}
