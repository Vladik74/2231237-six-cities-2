import {CityEnum} from './city.enum.js';
import {AmenitiesEnum} from './amenities.enum.js';
import {CoordinatesType} from './coords.js';
import {User} from './user.js';
import {HousingTypeEnum} from './housing.type.enum.js';

export type OfferType = {
  name: string;
  description: string;
  publicationDate: Date;
  city: CityEnum;
  previewImage: string;
  images: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  housingType: HousingTypeEnum;
  roomCount: number;
  guestCount: number;
  cost: number;
  amenities: AmenitiesEnum[];
  offerAuthor: User;
  commentsCount: number;
  coords: CoordinatesType;
}
