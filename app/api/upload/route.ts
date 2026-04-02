import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { classifyImage } from "@/app/lib/classifyImage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const designerName = (formData.get("designer") as string) || "Unknown";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/\s+/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filePath, buffer);

    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const aiData = await classifyImage(base64Image);

    const designer = await prisma.designer.upsert({
      where: { name: designerName },
      update: {},
      create: { name: designerName },
    });

    const image = await prisma.image.create({
      data: {
        filename,
        imageUrl: `/uploads/${filename}`,
        description: aiData.description || "No description",
        garmentType: aiData.garmentType || "Unknown",
        style: aiData.style || "Unknown",
        material: aiData.material || "Unknown",
        colorPalette: aiData.colorPalette || "Unknown",
        pattern: aiData.pattern || "Unknown",
        season: aiData.season || "Unknown",
        occasion: aiData.occasion || "Unknown",
        consumerProfile: aiData.consumerProfile || "Unknown",
        trendNotes: aiData.trendNotes || "Unknown",
        continent: aiData.continent || "Unknown",
        country: aiData.country || "Unknown",
        city: aiData.city || "Unknown",
        aiRawJson: JSON.stringify(aiData),
        designerId: designer.id,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("UPLOAD API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}