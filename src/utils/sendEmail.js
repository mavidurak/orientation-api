import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

export const sendEmail = async (user,value) => {

  let source ;
  let template;
  let replacements;
  const email = {
    sender: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to MaviDurak-IO',
    content: null,
    href: `${process.env.API_PATH}/authentication/email-confirmation?token=${value}`,
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

  replacements = {
    username:user.name,
    href: email.href,
  }
  source = fs.readFileSync('src/templates/emailConfirm.html','utf-8').toString();
  template= handlebars.compile(source);
  email.content = template(replacements);

  const info = await transporter.sendMail({
    sender: email.sender,
    to: email.to,
    subject: email.subject,
    html: email.content,
  });

};

export default {
  sendEmail,
};
