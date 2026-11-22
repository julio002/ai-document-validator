import { BadRequestException, Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { FILE_FIELD_NAME } from './documents.constants';
import { detectFileType, SupportedFileType } from './file-type';

/** Minimal view of an uploaded file, so the service does not depend on Multer. */
export interface UploadedDocument {
  originalname: string;
  size: number;
  buffer: Buffer;
}

export interface IntakeResult {
  documentId: string;
  fileName: string;
  fileType: SupportedFileType;
  sizeBytes: number;
  sha256: string;
  status: 'received';
}

@Injectable()
export class DocumentsService {
  /**
   * First step of the pipeline: checks that we actually received a supported
   * document and gives it an id and a content hash. Text extraction and
   * validation are added in the next steps (see ROADMAP.md).
   */
  intake(file: UploadedDocument | undefined): IntakeResult {
    if (!file) {
      throw new BadRequestException(
        `Send the document in the "${FILE_FIELD_NAME}" field (multipart/form-data).`,
      );
    }

    if (file.size === 0 || file.buffer.length === 0) {
      throw new BadRequestException('The file is empty.');
    }

    const fileType = detectFileType(file.buffer);
    if (!fileType) {
      throw new UnsupportedMediaTypeException('Only PDF, PNG and JPEG files are supported.');
    }

    return {
      documentId: randomUUID(),
      fileName: file.originalname,
      fileType,
      sizeBytes: file.size,
      sha256: createHash('sha256').update(file.buffer).digest('hex'),
      status: 'received',
    };
  }
}
