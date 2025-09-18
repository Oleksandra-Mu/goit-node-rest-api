import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import fs from "node:fs/promises";
// import cloudinary from "../helpers/cloudinary.js";
import path from "node:path";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

export const getUser = (query) => {
  return User.findOne({ where: query });
};

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const avatarURL = gravatar.url(payload.email, { s: "250", d: "retro" }, true);
  const user = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
  });
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
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

const avatarDir = path.resolve("public", "avatars");
export const updateAvatar = async (user, file) => {
  let avatarURL = null;
  if (file) {
    const newPath = path.join(avatarDir, file.filename);
    await fs.rename(file.path, newPath);
    avatarURL = path.join("avatars", file.filename);
    await user.update({ avatarURL });
  }
  return { avatarURL };
};
