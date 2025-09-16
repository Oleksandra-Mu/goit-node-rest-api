import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const getUser = (query) => {
  return User.findOne({ where: query });
};

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, password: hashPassword });
  return { email: user.email, subscription: user.subscription };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await getUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalid");
  }
  const { id: id, subscription: subscription } = user;
  const tokenPayload = {
    id,
  };
  const token = createToken(tokenPayload);
  await user.update({ token });

  return { token, user: { email: user.email, subscription } };
};

export const logoutUser = async (user) => {
  await user.update({ token: null });
  return user;
};
