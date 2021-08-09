import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

export const sendEmail = async (user, emailInfo, replacements) => {
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

  source = fs.readFileSync('src/templates/emailConfirm.html', 'utf-8').toString();
  template = handlebars.compile(source);
  createEmail.html = template(replacements);

  const info = await transporter.sendMail(createEmail);
};

export default {
  sendEmail,
};
