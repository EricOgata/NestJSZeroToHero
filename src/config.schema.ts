import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  POSTGRES_DB_USER: Joi.string().required(),
  POSTGRES_DB_PASSWORD: Joi.string().required(),
  POSTGRES_DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
