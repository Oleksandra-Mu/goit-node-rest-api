import jwt from "jsonwebtoken";

const { JWT_SECRET_KEY } = process.env;

export const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });

export const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    return { payload };
  } catch (error) {
    return { error };
  }
};
