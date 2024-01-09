import validator from 'convict-format-with-validator';
import convict from 'convict';


convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  JWT_SECRET: string;
  UPLOAD_DIR: string;
  STATIC_DIR_PATH: string;
  HOST: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Номер порта, на котором приложение ожидает подключений',
    format: 'port',
    env: 'PORT',
    default: 4055
  },
  SALT: {
    doc: 'Соль для хэширования паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Адрес сервера баз данных (валидный IP-адрес)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Имя пользователя для подключения к базе данных',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль для подключения к базе данных',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт для подключения к базе данных',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Имя базы данных',
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT token',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  UPLOAD_DIR: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIR',
    default: null
  },
  STATIC_DIR_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIR_PATH',
    default: 'static'
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  }
});
