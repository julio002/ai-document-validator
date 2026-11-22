import { detectFileType } from './file-type';

describe('detectFileType', () => {
  it('detects a PDF by its header', () => {
    expect(detectFileType(Buffer.from('%PDF-1.7\n...'))).toBe('pdf');
  });

  it('detects a PNG by its signature', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    expect(detectFileType(png)).toBe('png');
  });

  it('detects a JPEG by its signature', () => {
    expect(detectFileType(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]))).toBe('jpeg');
  });

  it('rejects other formats even if they claim to be a PDF', () => {
    expect(detectFileType(Buffer.from('just some text, named invoice.pdf'))).toBeNull();
  });

  it('rejects buffers shorter than any signature', () => {
    expect(detectFileType(Buffer.from([0xff, 0xd8]))).toBeNull();
    expect(detectFileType(Buffer.alloc(0))).toBeNull();
  });
});
