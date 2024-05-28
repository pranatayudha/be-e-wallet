import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  CURRENT_ENV: Joi.string().required(),
  // DATABASE
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.string().default(5432).required(),
  POSTGRES_USERNAME: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_SCHEMA: Joi.string().required(),
});
