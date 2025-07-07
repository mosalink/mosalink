import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const bookmark = await prisma.bookmark.findMany({
    where: {
      userId: params.id,
    },
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      image: true,
      tags: true,
      category: {
        select: {
          name: true,
          id: true,
          url: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      creationDate: "desc",
    },
  });

  return NextResponse.json(bookmark);
}
