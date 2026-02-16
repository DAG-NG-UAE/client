import mammoth from "mammoth";
import TurndownService from "turndown";

const turndownService = new TurndownService();

export const convertToMarkdown = async (file: File): Promise<string> => {
  const fileType = file.type;

  try {
    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await convertDocxToMarkdown(file);
    } else if (fileType === "application/pdf") {
      return await convertPdfToMarkdown(file);
    } else {
      throw new Error(
        "Unsupported file type. Please upload a .docx or .pdf file.",
      );
    }
  } catch (error) {
    console.error("Error converting file:", error);
    throw error;
  }
};

const convertDocxToMarkdown = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;
  return turndownService.turndown(html);
};

const convertPdfToMarkdown = async (file: File): Promise<string> => {
  // Dynamically import pdfjs-dist to avoid "canvas" dependency issues in Next.js build
  const pdfjsLib = (await import("pdfjs-dist/build/pdf")) as any;

  // Set worker
  if (
    typeof window !== "undefined" &&
    !pdfjsLib.GlobalWorkerOptions.workerSrc
  ) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n\n";
  }

  return text;
};
