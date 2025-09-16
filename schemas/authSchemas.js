import Joi from "joi";
import { subscriptions } from "../constants/userConstants.js";
import { emailRegexp } from "../constants/userConstants.js";
export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),

  subscription: Joi.string().valid(...subscriptions),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
