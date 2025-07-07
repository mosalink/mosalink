# Install project

- npm ci

# Run project

- npm run dev
- open [http://localhost:3000](http://localhost:3000)

# Create .env

- add variable

# Install Postgresql

- https://get.enterprisedb.com/postgresql/postgresql-16.9-2-windows-x64.exe

# Init database (supabase)

- Depuis >Mosalink_dev/
- Pour importer la base de donnée, exécuter :

```bash
$env:PGPASSWORD="SUPABASE_PASSWORD"; psql -h SUPABASE_SERVER -p 5432 -U postgres.SUPABASE_PROJECT_ID -d postgres -f "mosalink-24-01-2024.dump"
```

- Ajout d'un domain "Super-admin"
- Ajout d'un compte "Super-admin" à l'email "superadmin@mosalink.com"

```bash
$env:PGPASSWORD="SUPABASE_PASSWORD"; psql -h SUPABASE_SERVER -p 5432 -U postgres.SUPABASE_PROJECT_ID -d postgres -f "modification-bdd-colin.sql"
```

# A faire

```bash
npx prisma generate
```

---

## TODO

### Le "Cahier Des Charges"

- ✅ Gestion des "domaines"
  - ✅ Chaque utilisateur ne voit uniquement le domaine qui lui est attribué
  - ⬜️ Permettre à un utilisateur d'avoir accès a plusieurs domaines
- ✅ Création d'un compte et d'un espace superadmin
  - ✅ Interface dédiée super-admin avec header et navigation
  - ✅ Redirection automatique pour les super-admins
  - ✅ Scripts SQL
  - ✅ Permettre l'ajout/la suppression des domaines
  - ✅ Permettre la gestion des administrateurs de chaque domaine
- ⬜️ Harmonisation
  - Du design
  - Du vocabulaire
    - Utilisatation du mot "projet" (suppression du mot "groupe")
- ⬜️ Interface utilisateur
  - Correction des problèmes d'UI
    - ✅ Dropdown 'Catégories'
    - ✅ Select2 pour 'Gestion des catégories' et 'Gestion des utilisateurs' dans '/admin'
  - Ajout de nouvelles fonctionnalités
- ⬜️ Amélioration de la version mobile
- ⬜️ Gestion du système d'authentification (supprimer le système de vérification par e-mail et utiliser un système de mot de passe)

### Les différents problèmes

> ✅ Problème résolu (fix)  
> ❌ Problème non résolu

- ✅ Interface admin dans un domaine, ajout d'un nouvelle utilisateur qui est
- ✅ Interface admin dans un domaine, affichage des catégories
- ✅ Interface 'create bookmark', selection d'une catégorie

### Changement pour la production

- ✅ Création d'un repo GitHub
- ✅ Utilisation de Vercel pour le serveur de production (gratuit)
  - ✅ npm build en prod
  - ✅ Changer les variables du .env directement sur Vercel
- ✅ Changement au niveau du serveur SMTP (envoie de mail), utilisation de Mailtrap (gratuit)
  - Configuration de mailtrap (ajout d'un DNS)
  - Utilisatation du "Transactional Stream" (https://mailtrap.io/sending/domains)
    - Dans 'Sending Domains' puis Integration, puis Nodejs, utilisation de Nodemailer
- ✅ Utilisation de supabase (gratuit) pour la base de donnée
  - ✅ Création d'un compte
  - ✅ Migration vers supabase
  - ✅ Changement au niveau du code pour adapter à supabase

---

## Auteur du README

Colin LALLAURET
