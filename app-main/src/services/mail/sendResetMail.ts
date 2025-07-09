import { createTransport } from "nodemailer";

export async function sendResetMail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const provider = {
    server: {
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT || "587"),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    },
    from: process.env.EMAIL_FROM,
  };

  const transport = createTransport(provider.server);

  await new Promise((resolve, reject) => {
    transport.verify(function (error, success) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  await new Promise((resolve, reject) => {
    transport.sendMail(
      {
        to,
        from: provider.from,
        subject: "Réinitialisation de votre mot de passe",
        html: `
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        `,
      },
      (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
  return true;
}
