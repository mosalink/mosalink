import { Role } from "@prisma/client";
import prisma from "../lib/prisma";

async function main() {
  const superAdminDomain = await prisma.domain.upsert({
    where: { name: "super-admin" },
    update: {},
    create: {
      name: "super-admin",
      url: "super-admin",
      isPublish: false,
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mosalink.com" },
    update: {},
    create: {
      email: "superadmin@mosalink.com",
      name: "Super Administrateur",
      role: Role.SUPER_ADMIN,
      domain: {
        connect: {
          name: "super-admin",
        },
      },
    },
  });

  const domainTest = await prisma.domain.upsert({
    where: { name: "test" },
    update: {},
    create: {
      name: "test",
      url: "test",
      isPublish: true,
    },
  });
  const adminTest = await prisma.user.upsert({
    where: { email: "louisetiennegirard@gmail.com" },
    update: {},
    create: {
      email: "louisetiennegirard@gmail.com",
      role: Role.ADMIN,
      domain: {
        connect: {
          name: "test",
        },
      },
    },
  });
  const domainIUTLannionMMI = await prisma.domain.upsert({
    where: { name: "IUT-Lannion-MMI" },
    update: {},
    create: {
      name: "IUT-Lannion-MMI",
      url: "IUT-Lannion-MMI",
      isPublish: true,
    },
  });
  const adminIUTLannionMMI = await prisma.user.upsert({
    where: { email: "gregoire.cliquet@univ-rennes.fr" },
    update: {},
    create: {
      email: "gregoire.cliquet@univ-rennes.fr",
      role: Role.ADMIN,
      domain: {
        connect: {
          name: "IUT-Lannion-MMI",
        },
      },
    },
  });
  const domainUCODi = await prisma.domain.upsert({
    where: { name: "UCO DI" },
    update: {},
    create: {
      name: "UCO DI",
      url: "UCO-DI",
      isPublish: true,
    },
  });
  const adminUCODi = await prisma.user.upsert({
    where: { email: "sgirard@uco.fr" },
    update: {},
    create: {
      email: "sgirard@uco.fr",
      role: Role.ADMIN,
      domain: {
        connect: {
          name: "UCO DI",
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
