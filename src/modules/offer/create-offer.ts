import {CoordinatesType} from '../../types/coords.js';
import {AmenitiesEnum} from '../../types/amenities.enum.js';
import {HousingTypeEnum} from '../../types/housing.type.enum.js';
import {CityEnum} from '../../types/city.enum.js';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum, IsObject,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export default class CreateOffer {
  @MinLength(10, {message: 'Min length for name is 10'})
  @MaxLength(100, {message: 'Max length for name is 100'})
  public name!: string;

  @MinLength(20, {message: 'Min length for description is 20'})
  @MaxLength(1024, {message: 'Max length for description is 1024'})
  public description!: string;

  @IsEnum(CityEnum, {message: 'type must be one of the city'})
  public city!: CityEnum;

  @IsBoolean({message: 'field premium must be boolean'})
  public premium!: boolean;

  @IsEnum(HousingTypeEnum, {message: 'type must be one of the housing types'})
  public housingType!: HousingTypeEnum;

  @Min(1, {message: 'Min count of rooms is 1'})
  @Max(8, {message: 'Max count of rooms is 8'})
  public roomCount!: number;

  @Min(1, {message: 'Min count of guests is 1'})
  @Max(10, {message: 'Max count of guests is 10'})
  public guestCount!: number;

  @Min(100, {message: 'Min cost is 100'})
  @Max(100000, {message: 'Max cost is 100000'})
  public cost!: number;

  @IsArray({message: 'field facilities must be an array'})
  @IsEnum(AmenitiesEnum, {each: true, message: 'type must be one of the facilities'})
  @ArrayNotEmpty({message: 'There should be at least 1 facility'})
  public amenities!: AmenitiesEnum[];

  public userId!: string;

  @IsObject({message: 'There should be object CoordinatesType'})
  public coords!: CoordinatesType;
}
