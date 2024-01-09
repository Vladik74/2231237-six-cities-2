import {IsOptional} from 'class-validator';

export default class UpdateUser {
  @IsOptional()
  public email?: string;

  @IsOptional()
  public username?: string;

  @IsOptional()
  public avatar?: string;
}
