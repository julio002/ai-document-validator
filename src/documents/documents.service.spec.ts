import { BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { DocumentsService, UploadedDocument } from './documents.service';

function fileFrom(content: Buffer, name = 'document.pdf'): UploadedDocument {
  return { originalname: name, size: content.length, buffer: content };
}

describe('DocumentsService.intake', () => {
  const service = new DocumentsService();

  it('accepts a PDF and returns its id, type and hash', () => {
    const content = Buffer.from('%PDF-1.7\nfake but valid header');

    const result = service.intake(fileFrom(content, 'invoice.pdf'));

    expect(result).toMatchObject({
      fileName: 'invoice.pdf',
      fileType: 'pdf',
      sizeBytes: content.length,
      status: 'received',
    });
    expect(result.documentId).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.sha256).toBe(createHash('sha256').update(content).digest('hex'));
  });

  it('rejects a request without a file', () => {
    expect(() => service.intake(undefined)).toThrow(BadRequestException);
  });

  it('rejects an empty file', () => {
    expect(() => service.intake(fileFrom(Buffer.alloc(0)))).toThrow(BadRequestException);
  });

  it('rejects unsupported formats', () => {
    const text = fileFrom(Buffer.from('plain text pretending to be a PDF'), 'fake.pdf');

    expect(() => service.intake(text)).toThrow(UnsupportedMediaTypeException);
  });
});
