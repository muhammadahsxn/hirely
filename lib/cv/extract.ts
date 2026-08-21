import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    return result.text;
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
}