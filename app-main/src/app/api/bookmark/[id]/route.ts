import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { isAdminDomain } from "@/utils/roles/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const bookmark = await prisma.bookmark.findUnique({
    where: {
      id: params.id,
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const userIdBookmark = await prisma.bookmark.findUnique({
    where: {
      id: params.id,
    },
    select: {
      userId: true,
      domainId: true,
    },
  });

  if (
    userIdBookmark &&
    (isAdminDomain(session.user, userIdBookmark.domainId) ||
      userIdBookmark.userId === session.user.id)
  ) {
    const bookmarkDelete = await prisma.bookmark.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(bookmarkDelete);
  }

  return NextResponse.json({
    message: "Vous n'avez pas les droits pour supprimer ce bookmark",
    status: 403,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.title && !data.url && !data.categoryId && !data.description) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const userIdBookmark = await prisma.bookmark.findUnique({
    where: {
      id: params.id,
    },
    select: {
      userId: true,
      domainId: true,
    },
  });

  if (
    userIdBookmark &&
    (isAdminDomain(session.user, userIdBookmark.domainId) ||
      userIdBookmark.userId === session.user.id)
  ) {
    const bookmark = await prisma.bookmark.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        url: data.url,
        description: data.description,
        tags: data.tags,
        category: {
          connect: {
            id: data.categoryId,
          },
        },
        image: data.image,
      },
    });
    return NextResponse.json(bookmark);
  }
}
