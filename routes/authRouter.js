import express from "express";

import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import authControllers from "../controllers/authControllers.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();
authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.registerController
);

authRouter.post(
  "/login",
  validateBody(loginSchema),
  authControllers.loginController
);

authRouter.get("/current", authenticate, authControllers.currentController);

authRouter.post("/logout", authenticate, authControllers.logoutController);

authRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  authControllers.updateAvatarController
);
export default authRouter;
