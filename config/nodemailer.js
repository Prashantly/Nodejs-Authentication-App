require("dotenv").config();
const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "salted",
  product: {
    name: "Authentication app",
    link: "https://nodejs-authentication-app-ikrj.onrender.com",
  },
});
//localhost:8000

http: module.exports = {
  transporter,
  mailGenerator,
};
