import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  const deleteBookmarks = await prisma.bookmark.deleteMany({
    where: {
      categoryId: params.id,
    },
  });

  const deleteCategory = await prisma.category.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({ deleteBookmarks, deleteCategory });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.name && !data.url) {
    return NextResponse.error;
  }

  const category = await prisma.category.update({
    where: {
      id: params.id,
    },
    data: {
      name: data.name,
      url: data.url,
    },
  });

  console.log(category);

  return NextResponse.json(category);
}
