import { Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_FIELD_NAME, MAX_FILE_SIZE_BYTES } from './documents.constants';
import { DocumentsService, IntakeResult } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  /**
   * Receives a document for validation.
   *
   * Returns 202 Accepted: the file was received and checked, and the next steps of
   * the pipeline (extraction and validation) will build on this response.
   */
  @Post('validate')
  @HttpCode(202)
  @UseInterceptors(
    FileInterceptor(FILE_FIELD_NAME, { limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 } }),
  )
  validate(@UploadedFile() file: Express.Multer.File | undefined): IntakeResult {
    return this.documents.intake(file);
  }
}
