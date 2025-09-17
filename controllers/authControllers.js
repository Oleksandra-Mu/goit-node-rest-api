import { subscriptions } from "../constants/userConstants.js";
import * as authServices from "../services/authServices.js";

const registerController = async (req, res, next) => {
  try {
    if (await authServices.getUser({ email: req.body.email })) {
      return res.status(409).json({ message: "Email in use" });
    }
    const { email, subscription } = await authServices.registerUser(req.body);

    res
      .status(201)
      .json({ user: { email, subscription }, message: "User created" });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { token, user } = await authServices.loginUser(req.body);

    res.json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const currentController = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutController = async (req, res) => {
  await authServices.logoutUser(req.user);
  res.status(204);
};
export default {
  registerController,
  loginController,
  currentController,
  logoutController,
};
