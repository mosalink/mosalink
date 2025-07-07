-- Domain super-admin
INSERT INTO "Domain" (
    id,
    name,
    url,
    "isPublish",
    "maximumCategories",
    "creationDate",
    "lastUpdateDate"
) VALUES (
    'superadmin_domain_' || extract(epoch from now())::bigint,
    'super-admin',
    'super-admin',
    false,
    10,
    now(),
    now()
) ON CONFLICT (name) DO NOTHING;

-- User super-admin
INSERT INTO "User" (
    id,
    name,
    email,
    role,
    "isBanned",
    "domainId",
    "creationDate",
    "lastUpdateDate"
) VALUES (
    'superadmin_user_' || extract(epoch from now())::bigint,
    'Super Administrateur',
    'superadmin@mosalink.com',
    'SUPER_ADMIN',
    false,
    (SELECT id FROM "Domain" WHERE name = 'super-admin' LIMIT 1),
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    role = 'SUPER_ADMIN',
    "domainId" = (SELECT id FROM "Domain" WHERE name = 'super-admin' LIMIT 1),
    "lastUpdateDate" = now();