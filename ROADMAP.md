# Roadmap

One step per week. Each step is one pull request with tests.

- [x] **1. Project setup and file intake** — NestJS API, `POST /documents/validate` that accepts PDF, PNG and JPEG (checked by file signature, max 10 MB), unit and e2e tests, CI, Docker.
- [ ] **2. Text extraction** — read the text layer of PDFs and run OCR on images, behind one `TextExtractor` interface so the source can change without touching the rest.
- [ ] **3. Document schemas** — describe each document type (for example invoice and proof of address) as a schema with its fields and rules, using synthetic sample documents only.
- [ ] **4. LLM extraction** — provider-agnostic LLM client that fills the schema with structured output, with retries and a fake client for tests.
- [ ] **5. Validation rules** — field checks (Brazilian CPF/CNPJ check digits, dates, totals), cross-field rules and a confidence score per field.
- [ ] **6. Human review** — fields below a confidence threshold are flagged for review, with a clear response contract.
- [ ] **7. Evaluation** — small synthetic dataset and a script that measures field accuracy, so changes to prompts or models can be compared.
- [ ] **8. Async processing** — queue for large files and a job status endpoint.
- [ ] **9. API docs and demo** — OpenAPI docs, `docker compose up` demo and sample requests.
- [ ] **10. Write-up** — architecture decisions, results and limitations in the README.
