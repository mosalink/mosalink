const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 border-t p-4">
      <p className="text-sm">
        Les utilisateurs assument l’entière et l’unique responsabilité des liens
        qu’ils ajoutent sur la plateforme mosalink.com
      </p>
      <p className="text-sm">
        Parce que l&apos;humanité se construit sur l&apos;échange et le partage
      </p>
      <a className="text-sm font-bold" href="mailto:hello@mosalink.com">
        hello@mosalink.com
      </a>
      <p className="text-sm">© Tous droits réservés</p>
    </div>
  );
};

export default Footer;
