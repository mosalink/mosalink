import { Provider } from "next-auth/providers";
import { createTransport } from "nodemailer";

interface Params {
  provider: any;
  identifier: any;
  host: any;
  subject: string;
  text: string;
  html: string;
}

export default async function sendMail({
  provider,
  identifier,
  host,
  subject,
  text,
  html,
}: Params) {
  let transport: any;
  
  if (typeof provider.server === 'object') {
    transport = createTransport(provider.server);
  } else {
    transport = createTransport(provider.server);
  }

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transport.verify(function (error: any, success: any) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transport.sendMail(
      {
        to: identifier,
        from: provider.from,
        subject,
        text,
        html,
      },
      (err: any, info: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
}
