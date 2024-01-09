import {OfferType} from '../types/offer.type.js';
import {CityEnum} from '../types/city.enum.js';
import {HousingTypeEnum} from '../types/housing.type.enum.js';
import {AmenitiesEnum} from '../types/amenities.enum.js';
import {UserTypeEnum} from '../types/user.type.enum.js';

export function createNewOffer(offer: string): OfferType {
  const offerRow = offer.replace('\n', '').split('\t');
  const [name,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    housingType,
    roomCount,
    guestCount,
    cost,
    amenities,
    offerAuthorName,
    offerAuthorAvatar,
    offerAuthorType,
    offerAuthorEmail,
    commentsCount,
    latitude,
    longitude] = offerRow;
  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    city: city as unknown as CityEnum,
    previewImage: previewImage,
    images: images.split(','),
    premium: premium as unknown as boolean,
    favorite: favorite as unknown as boolean,
    rating: parseFloat(rating),
    housingType: housingType as unknown as HousingTypeEnum,
    roomCount: parseInt(roomCount, 10),
    guestCount: parseInt(guestCount, 10),
    cost: parseInt(cost, 10),
    amenities: amenities.split(',').map((x) => x as unknown as AmenitiesEnum),
    offerAuthor: {
      username: offerAuthorName,
      avatar: offerAuthorAvatar,
      type: offerAuthorType as unknown as UserTypeEnum,
      email: offerAuthorEmail
    },
    commentsCount: parseInt(commentsCount, 10),
    coords: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
  };
}
