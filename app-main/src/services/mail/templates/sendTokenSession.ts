interface Params {
  url: string;
  host: string;
}

function html({ url, host }: Params) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#346df1";
  const color = {
    background: "#fff",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Bienvenue sur mosalink
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                  target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                  Se connecter</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Si vous n'êtes pas à l'origine de ce mail, vous pouvez l'ignorer.
        </td>
      </tr>
    </table>
    <a href="${url}">${process.env.NEXT_PUBLIC_APP_NAME}</a>
  </body>
  `;
}

function text({ url, host }: Params) {
  return `Votre lien de connection: ${host}\n${url}\n\n`;
}

export default function sendTokenSessionMailContent({ url, host }: Params) {
  return {
    text: text({ url, host }),
    html: html({ url, host }),
  };
}
