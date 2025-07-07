import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Créer un domaine super-admin s'il n'existe pas
    const superAdminDomain = await prisma.domain.upsert({
      where: { name: "super-admin" },
      update: {},
      create: {
        name: "super-admin",
        url: "super-admin",
        isPublish: false,
      },
    });

    console.log('Domaine super-admin créé:', superAdminDomain);

    // Créer l'utilisateur super admin s'il n'existe pas
    const superAdmin = await prisma.user.upsert({
      where: { email: "superadmin@mosalink.com" },
      update: {
        role: Role.SUPER_ADMIN
      },
      create: {
        email: "superadmin@mosalink.com",
        name: "Super Administrateur",
        role: Role.SUPER_ADMIN,
        domainId: superAdminDomain.id,
      },
    });

    console.log('Utilisateur super admin créé:', superAdmin);
    
    // Vérifier tous les domaines existants
    const allDomains = await prisma.domain.findMany({
      include: {
        users: {
          where: { role: "ADMIN" }
        },
        _count: {
          select: {
            users: true,
            categories: true,
            bookmark: true
          }
        }
      }
    });

    console.log('Domaines existants:', allDomains.length);
    allDomains.forEach(domain => {
      console.log(`- ${domain.name} (${domain.url}) - ${domain._count.users} utilisateurs, ${domain._count.categories} catégories, ${domain._count.bookmark} signets`);
    });

  } catch (error) {
    console.error('Erreur lors de la création du super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
