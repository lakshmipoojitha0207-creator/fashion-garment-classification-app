import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function uniqueClean(values: (string | null)[]) {
  return [...new Set(values.filter((v): v is string => !!v && v !== "Unknown"))];
}

export async function GET() {
  const images = await prisma.image.findMany({
    include: {
      designer: true,
    },
  });

  const filters = {
    garmentTypes: uniqueClean(images.map((i) => i.garmentType)),
    styles: uniqueClean(images.map((i) => i.style)),
    countries: uniqueClean(images.map((i) => i.country)),
    designers: uniqueClean(images.map((i) => i.designer?.name || null)),
  };

  return NextResponse.json(filters);
}