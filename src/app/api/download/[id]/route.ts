import { NextRequest, NextResponse } from "next/server";
import templatesData from "@/data/templates.json";
import fileMapData from "@/data/file-map.json";
import { TemplateItem } from "@/types/resume";

const templates = templatesData as TemplateItem[];
const fileMap = fileMapData as Record<string, string>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const format = (request.nextUrl.searchParams.get("format") || "pdf").toLowerCase();
  const variantParam = Number(request.nextUrl.searchParams.get("variant") || "0");

  const template = templates.find((t) => t.id === id);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const matchingVariants = (template.variants || []).filter(
    (v) => v.format === (format === "docx" ? "docx" : "pdf")
  );
  const chosenVariant =
    matchingVariants[variantParam] || matchingVariants[0] || null;

  const relPath =
    chosenVariant?.relPath ||
    (format === "docx" ? template.docxRelPath : template.pdfRelPath);

  if (!relPath) {
    return NextResponse.json(
      { error: `Format ${format.toUpperCase()} not available for this template` },
      { status: 404 }
    );
  }

  const publicUrl = fileMap[relPath];
  if (!publicUrl) {
    return NextResponse.json({ error: "Source file not found" }, { status: 404 });
  }

  return NextResponse.redirect(new URL(publicUrl, request.url), 302);
}
