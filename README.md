# Mosalink

## Stack

- App : React + Next.js (TypeScript)
- SMTP : [Mailtrap](https://mailtrap.io/sending/domains/3a9bad16-0eaf-4f4f-aee5-77bb96dbb14a?current_tab=smtp_settings&stream=transactional)
- Base de donnée : [Supabase](https://supabase.com/dashboard/project/fffjtgfrxydfcngvtlnx/editor/17316?sort=emailVerified%3Adesc)
- Hébergement : [Vercel](https://vercel.com/mosalinks-projects/mosalink)
- Gestion du nom de domaine : [OVH](https://www.ovh.com/manager/#/web/domain/mosalink.com/information)
- Versioning : [GitHub](https://github.com/mosalink/mosalink)

## Connexion

- id : mosalink.projet@gmail.com
- pass : First caractère "N", last caractère "4" (gregoire.cliquet@univ-rennes.fr)
- Pour la connexion à Mailtrap, Supabase et Vercel faire "Continue with GitHub"

## Installation en local

```
git pull
cd .\app-main\
npm install
npm run dev
```

⚠️ Configurer/récupérer le .env (.env.exemple disponible) ⚠️

## Initialisation de la base de donnée

```
# $env:PGPASSWORD="[SUPABASE_PASSWORD]"; psql -h aws-0-eu-west-3.pooler.supabase.com -p 5432 -U postgres.[SUPABASE_PROJECT_ID] -d postgres -f "mosalink-24-01-2024.dump"

# Puis modification de la base et ajout de mes données
# $env:PGPASSWORD="[SUPABASE_PASSWORD]"; psql -h aws-0-eu-west-3.pooler.supabase.com -p 5432 -U postgres.[SUPABASE_PROJECT_ID] -d postgres -f "modification-bdd-colin.sql"
```
