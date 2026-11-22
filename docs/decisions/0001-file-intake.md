# 0001 — File intake: check the file signature, not the extension

## Context

The API receives documents uploaded by other systems. The file name and the `Content-Type`
header are set by the client, so they can be wrong (a scanner that names everything `.pdf`)
or forged on purpose.

## Decision

- Read the first bytes of the file (its signature, or "magic bytes") to decide if it is a
  PDF, PNG or JPEG. Anything else gets `415 Unsupported Media Type`, whatever its name.
- Limit uploads to 10 MB in the upload middleware, so a large file is rejected with
  `413 Payload Too Large` before it is fully read into memory.
- Return a SHA-256 hash of the content. Later steps can use it to detect duplicates and to
  cache extraction results.
- Answer `202 Accepted`, because receiving the file is only the first step of the pipeline.

## Consequences

- A corrupted file with a valid header still passes this step; the extraction step must
  handle parse errors.
- Files are kept in memory. That is fine at 10 MB; larger files will need streaming to
  storage (roadmap step 8).
