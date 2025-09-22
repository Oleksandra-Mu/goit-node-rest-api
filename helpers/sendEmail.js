import nodemailer from "nodemailer";
import dotenv from "dotenv";

const { UKR_NET_EMAIL, UKR_NET_PASS } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASS,
  },
};

const transporter = nodemailer.createTransport(config);
const sendEmail = (payload) => {
  const email = { ...payload, from: UKR_NET_EMAIL };
  return transporter.sendMail(email);
};

export default sendEmail;
