import User from "../db/User.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import fs from "node:fs/promises";
// import cloudinary from "../helpers/cloudinary.js";
import path from "node:path";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

const { BASE_URL } = process.env;

export const getUser = (query) => {
  return User.findOne({ where: query });
};

const createVerifyEmail = ({ email, verificationToken }) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
});

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const avatarURL = gravatar.url(payload.email, { s: "250", d: "retro" }, true);
  const verificationToken = nanoid();
  const user = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = createVerifyEmail({
    verificationToken,
    email: payload.email,
  });

  await sendEmail(verifyEmail);
  return {
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  };
};

export const verifyUser = async (verificationToken) => {
  const user = await getUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found or already verified");
  }
  await user.update({ verify: true, verificationToken: null });
};

export const resendVerifyEmail = async (email) => {
  const user = await getUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = createVerifyEmail({
    verificationToken: user.verificationToken,
    email,
  });
  await sendEmail(verifyEmail);
  return { message: "Verification email sent" };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await getUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
