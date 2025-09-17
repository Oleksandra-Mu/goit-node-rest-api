import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";
import { subscriptions } from "../constants/userConstants.js";
import { emailRegexp } from "../constants/userConstants.js";
import e from "express";

const User = sequelize.define("user", {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: emailRegexp,
    },
    unique: {
      args: true,
      msg: "Email in use",
    },
  },
  subscription: {
    type: DataTypes.ENUM(...subscriptions),
    defaultValue: subscriptions[0],
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// User.sync({ alter: true });

export default User;
