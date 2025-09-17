import HttpError from "../helpers/HttpError.js";
import { getUser } from "../services/authServices.js";
import { verifyToken } from "../helpers/jwt.js";
const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw HttpError(401, "Authorization header is missing");
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw HttpError(401, "Authorization header must be Bearer");
    }

    const { payload, error } = verifyToken(token);
    if (error) {
      throw HttpError(401, error.message);
    }
    const user = await getUser({ id: payload.id });
    if (!user) {
      throw HttpError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
