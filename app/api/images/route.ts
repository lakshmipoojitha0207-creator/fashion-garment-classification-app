import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const garmentType = searchParams.get("garmentType") || "";
  const style = searchParams.get("style") || "";
  const country = searchParams.get("country") || "";
  const designer = searchParams.get("designer") || "";

  const images = await prisma.image.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { description: { contains: search } },
                { garmentType: { contains: search } },
                { style: { contains: search } },
                { material: { contains: search } },
                { country: { contains: search } },
              ],
            }
          : {},
        garmentType ? { garmentType } : {},
        style ? { style } : {},
        country ? { country } : {},
        designer ? { designer: { name: designer } } : {},
      ],
    },
    include: {
      designer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(images);
}