import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MAX_FILE_SIZE_BYTES } from '../src/documents/documents.constants';

describe('API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health is up', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
  });

  describe('POST /documents/validate', () => {
    it('accepts a PDF', async () => {
      const pdf = Buffer.from('%PDF-1.7\nsample');

      const response = await request(app.getHttpServer())
        .post('/documents/validate')
        .attach('file', pdf, { filename: 'invoice.pdf', contentType: 'application/pdf' })
        .expect(202);

      expect(response.body).toMatchObject({ fileType: 'pdf', fileName: 'invoice.pdf' });
    });

    it('rejects a request without a file with 400', async () => {
      await request(app.getHttpServer()).post('/documents/validate').expect(400);
    });

    it('rejects an unsupported format with 415, even with a .pdf name', async () => {
      await request(app.getHttpServer())
        .post('/documents/validate')
        .attach('file', Buffer.from('not a pdf'), {
          filename: 'fake.pdf',
          contentType: 'application/pdf',
        })
        .expect(415);
    });

    it('rejects files over the size limit with 413', async () => {
      const tooBig = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1, 0x20);
      tooBig.write('%PDF-1.7', 0);

      await request(app.getHttpServer())
        .post('/documents/validate')
        .attach('file', tooBig, { filename: 'big.pdf', contentType: 'application/pdf' })
        .expect(413);
    });
  });
});
