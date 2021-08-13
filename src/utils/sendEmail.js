import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import { EMAIL_TYPES } from '../constants/email';

export const sendEmail = async (user, emailInfo, replacements) => {
  const { emailType } = emailInfo;
  let source;
  let template;
  const createEmail = {
    sender: process.env.EMAIL_USER,
    to: user.email,
    subject: emailInfo.subject,
    html: null,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  switch (emailType) {
  case EMAIL_TYPES.EMAIL_VALIDATION:
    source = fs.readFileSync('src/templates/emailConfirm.html', 'utf-8').toString();
    break;

  case EMAIL_TYPES.FORGOT_PASSWORD:
    source = fs.readFileSync('src/templates/forgotPassword.html', 'utf-8').toString();
    break;

  default:
    break;
  }

  template = handlebars.compile(source);
  createEmail.html = template(replacements);

  await transporter.sendMail(createEmail);
};

export default {
  sendEmail,
};
