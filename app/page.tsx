"use client";

import { useEffect, useState } from "react";

type ImageItem = {
  id: number;
  imageUrl: string;
  description: string;
  garmentType?: string | null;
  style?: string | null;
  material?: string | null;
  country?: string | null;
  designer?: {
    name: string;
  } | null;
};

type Filters = {
  garmentTypes: string[];
  styles: string[];
  countries: string[];
  designers: string[];
};

export default function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [filters, setFilters] = useState<Filters>({
    garmentTypes: [],
    styles: [],
    countries: [],
    designers: [],
  });

  const [search, setSearch] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [style, setStyle] = useState("");
  const [country, setCountry] = useState("");
  const [designer, setDesigner] = useState("");

  async function loadImages() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (garmentType) params.set("garmentType", garmentType);
    if (style) params.set("style", style);
    if (country) params.set("country", country);
    if (designer) params.set("designer", designer);

    const res = await fetch(`/api/images?${params.toString()}`);
    const data = await res.json();
    setImages(data);
  }

  async function loadFilters() {
    const res = await fetch("/api/filters");
    const data = await res.json();
    setFilters(data);
  }

  useEffect(() => {
    loadFilters();
    loadImages();
  }, []);

  useEffect(() => {
    loadImages();
  }, [search, garmentType, style, country, designer]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fashion Inspiration Library</h1>
        <a href="/upload" className="bg-black text-white px-4 py-2 rounded">
          Upload Image
        </a>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Garment Types</option>
          {filters.garmentTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Styles</option>
          {filters.styles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Countries</option>
          {filters.countries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={designer}
          onChange={(e) => setDesigner(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Designers</option>
          {filters.designers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm">
              <img
                src={image.imageUrl}
                alt={image.description}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">
                  {image.garmentType || "Unknown Garment"}
                </h2>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {image.description}
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>Style:</strong> {image.style || "Unknown"}</p>
                  <p><strong>Material:</strong> {image.material || "Unknown"}</p>
                  <p><strong>Country:</strong> {image.country || "Unknown"}</p>
                  <p><strong>Designer:</strong> {image.designer?.name || "Unknown"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}