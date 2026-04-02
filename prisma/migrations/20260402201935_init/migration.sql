-- CreateTable
CREATE TABLE "Designer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "garmentType" TEXT,
    "style" TEXT,
    "material" TEXT,
    "colorPalette" TEXT,
    "pattern" TEXT,
    "season" TEXT,
    "occasion" TEXT,
    "consumerProfile" TEXT,
    "trendNotes" TEXT,
    "continent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "capturedYear" INTEGER,
    "capturedMonth" INTEGER,
    "capturedSeason" TEXT,
    "aiRawJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "designerId" INTEGER,
    CONSTRAINT "Image_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "Designer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageId" INTEGER NOT NULL,
    "tags" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Annotation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Designer_name_key" ON "Designer"("name");
