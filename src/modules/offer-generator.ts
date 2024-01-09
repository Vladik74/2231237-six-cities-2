import {MockData} from '../types/mock-offer.type.js';
import {generateRandomValue, getRandomItem, getRandomItems} from '../helpers/random.js';
import {
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  MAX_COUNT_ROOM,
  MAX_GUESTS,
  MAX_RATING,
  MAX_RENT_COST,
  MIN_COUNT_ROOM,
  MIN_GUESTS,
  MIN_RATING,
  MIN_RENT_COST
} from '../types/consts.js';
import {CityEnum} from '../types/city.enum.js';
import {HousingTypeEnum} from '../types/housing.type.enum.js';
import {AmenitiesEnum} from '../types/amenities.enum.js';
import {UserTypeEnum} from '../types/user.type.enum.js';
import dayjs from 'dayjs';

export interface OfferGeneratorInterface {
  generate(): string;
}

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem([CityEnum.Amsterdam, CityEnum.Cologne, CityEnum.Brussels, CityEnum.Paris, CityEnum.Hamburg, CityEnum.Dusseldorf]);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images);
    const premium = getRandomItem<string>(['true', 'false']);
    const favorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const housingType = getRandomItem([HousingTypeEnum.House, HousingTypeEnum.Hotel, HousingTypeEnum.Room, HousingTypeEnum.Apartment]);
    const roomCount = generateRandomValue(MIN_COUNT_ROOM, MAX_COUNT_ROOM);
    const guestCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const cost = generateRandomValue(MIN_RENT_COST, MAX_RENT_COST);
    const facilities = getRandomItems([AmenitiesEnum.AirConditioning, AmenitiesEnum.BabySeat, AmenitiesEnum.Fridge]);
    const offerAuthorName = getRandomItem<string>(this.mockData.users.usernames);
    const offerAuthorAvatar = getRandomItem<string>(this.mockData.users.avatars);
    const offerAuthorType = getRandomItem([UserTypeEnum.pro, UserTypeEnum.simple]);
    const offerAuthorNameEmail = getRandomItem<string>(this.mockData.users.emails);
    const offerAuthorNamePassword = getRandomItem<string>(this.mockData.users.passwords);
    const commentsCount = generateRandomValue(1, 10);
    const latitude = getRandomItem<number>(this.mockData.coordinates.latitude);
    const longitude = getRandomItem<number>(this.mockData.coordinates.longitude);

    return [
      name, description, publicationDate,
      city, previewImage, images, premium,
      favorite, rating, housingType, roomCount,
      guestCount, cost, facilities, offerAuthorName,
      offerAuthorAvatar, offerAuthorType, offerAuthorNameEmail,
      offerAuthorNamePassword, commentsCount, latitude, longitude
    ].join('\t');
  }
}
