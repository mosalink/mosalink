import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.bookmarkId || !data.folderId) {
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
      id: data.folderId,
    },
    data: {
      bookmarks: {
        connect: {
          id: data.bookmarkId,
        },
      },
    },
  });

  return NextResponse.json(bookmark);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.bookmarkId || !data.folderId) {
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
      id: data.folderId,
    },
    data: {
      bookmarks: {
        disconnect: {
          id: data.bookmarkId,
        },
      },
    },
  });

  return NextResponse.json(bookmark);
}
