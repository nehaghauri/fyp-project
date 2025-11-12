// src/lib/documentParser.ts
import * as mammoth from 'mammoth';
import * as cheerio from 'cheerio';
import Papa from 'papaparse';

interface ParsedDocument {
  content: string;
  filename: string;
  category: string;
  chunks: string[];
  metadata: {
    fileType: string;
    wordCount: number;
    chunkCount: number;
  };
}

/**
 * Parse different file types and extract text content
 */
export async function parseDocument(
  file: File,
  category: string
): Promise<ParsedDocument> {
  const filename = file.name;
  const fileType = file.name.split('.').pop()?.toLowerCase() || 'unknown';
  
  let content = '';

  try {
    switch (fileType) {
      case 'pdf':
        content = await parsePDF(file);
        break;
      case 'docx':
        content = await parseDOCX(file);
        break;
      case 'html':
      case 'htm':
        content = await parseHTML(file);
        break;
      case 'txt':
      case 'md':
        content = await parseTXT(file);
        break;
      case 'csv':
        content = await parseCSV(file);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Clean the content
    content = cleanText(content);

    // Split into chunks (500 characters per chunk with 50 char overlap)
    const chunks = chunkText(content, 500, 50);

    const wordCount = content.split(/\s+/).length;

    return {
      content,
      filename,
      category,
      chunks,
      metadata: {
        fileType,
        wordCount,
        chunkCount: chunks.length,
      },
    };
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    throw error;
  }
}

/**
 * Parse PDF files (basic text extraction)
 */
async function parsePDF(file: File): Promise<string> {
  // Note: For full PDF parsing, you'd need pdf-parse library
  // This is a placeholder that reads as text
  const text = await file.text();
  return text;
}

/**
 * Parse DOCX files using mammoth
 */
async function parseDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse HTML files using cheerio
 */
async function parseHTML(file: File): Promise<string> {
  const html = await file.text();
  const $ = cheerio.load(html);
  
  // Remove script and style tags
  $('script, style').remove();
  
  // Extract text content
  const text = $('body').text() || $.text();
  return text;
}

/**
 * Parse plain text files
 */
async function parseTXT(file: File): Promise<string> {
  return await file.text();
}

/**
 * Parse CSV files using PapaParse
 */
async function parseCSV(file: File): Promise<string> {
  const text = await file.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      complete: (results) => {
        // Convert CSV data to readable text format
        const lines = results.data.map((row: any) => {
          if (Array.isArray(row)) {
            return row.join(' | ');
          }
          return JSON.stringify(row);
        });
        resolve(lines.join('\n'));
      },
      error: (error) => reject(error),
      dynamicTyping: true,
      skipEmptyLines: true,
    });
  });
}

/**
 * Clean extracted text
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}

/**
 * Split text into overlapping chunks
 */
function chunkText(
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk.trim());
    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Parse multiple documents at once
 */
export async function parseMultipleDocuments(
  files: File[],
  category: string
): Promise<ParsedDocument[]> {
  const results = await Promise.allSettled(
    files.map(file => parseDocument(file, category))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<ParsedDocument> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
}