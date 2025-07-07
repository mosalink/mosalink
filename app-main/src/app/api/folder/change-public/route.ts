import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.isPublic && !data.id) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const bookmark = await prisma.folder.update({
    where: {
      id: data.id,
    },
    data: {
      isPublish: data.isPublish,
    },
  });

  return NextResponse.json(bookmark);
}
