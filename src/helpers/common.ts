import * as crypto from 'crypto';
import * as jose from 'jose';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {DEFAULT_STATIC_IMAGES} from '../types/consts.js';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const getConnectionString = (
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string,
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;

export const createSHA256 = (line: string, salt: string): string => {
  const hashed = crypto.createHmac('sha256', salt);
  return hashed.update(line).digest('hex');
};

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}

export async function createJWT(algorithm: string, jwtSecret: string, payload: object): Promise<string> {
  return new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('1d').sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  obj: Record<string, unknown>,
  transformFunc: (object: Record<string, unknown>) => void
) {
  return Object.keys(obj)
    .forEach((key) => {
      if (key === property) {
        transformFunc(obj);
      } else if (isObject(obj[key])) {
        transformProperty(property, obj[key] as Record<string, unknown>, transformFunc);
      }
    });
}

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data: Record<string, unknown>) {
  return properties
    .forEach((property) => {
      transformProperty(property, data, (target: Record<string, unknown>) => {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
        target[property] = `${rootPath}/${target[property]}`;
      });
    });
}

