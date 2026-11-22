export type SupportedFileType = 'pdf' | 'png' | 'jpeg';

/**
 * File signatures ("magic bytes") of the formats we accept.
 *
 * We look at the first bytes of the file instead of trusting the extension or the
 * Content-Type sent by the client, because both can be wrong or forged.
 */
const SIGNATURES: ReadonlyArray<{ type: SupportedFileType; bytes: readonly number[] }> = [
  { type: 'pdf', bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // "%PDF-"
  { type: 'png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: 'jpeg', bytes: [0xff, 0xd8, 0xff] },
];

export function detectFileType(buffer: Buffer): SupportedFileType | null {
  for (const signature of SIGNATURES) {
    const matches =
      buffer.length >= signature.bytes.length &&
      signature.bytes.every((byte, index) => buffer[index] === byte);

    if (matches) {
      return signature.type;
    }
  }

  return null;
}
