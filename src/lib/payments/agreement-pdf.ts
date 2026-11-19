interface SignedPdfInput {
  retreatName: string;
  participantName: string;
  bookingReference: string;
  termsVersion: string;
  agreementReference: string;
  signedAt: string;
  termsSnapshot: string;
  acceptanceText: string;
  documentHash: string;
}

function buildPdf(lines: string[]): Buffer {
  const normalized = lines.flatMap((line) => {
    const safe = line.normalize('NFKD').replace(/[^\x20-\x7E]/g, '');
    const words = safe.split(/\s+/);
    const result: string[] = [];
    let current = '';
    for (const word of words) {
      if (current && `${current} ${word}`.length > 92) { result.push(current); current = word; }
      else current = current ? `${current} ${word}` : word;
    }
    result.push(current);
    return result;
  });
  const pages: string[][] = [];
  for (let i = 0; i < normalized.length; i += 54) pages.push(normalized.slice(i, i + 54));
  const objects: string[] = [''];
  const pageIds = pages.map((_, index) => 4 + index * 2);
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  pages.forEach((page, index) => {
    const pageId = pageIds[index];
    const streamId = pageId + 1;
    const stream = page.map((line, row) => `BT /F1 9 Tf 48 ${790 - row * 13} Td (${line.replace(/([\\()])/g, '\\$1')}) Tj ET`).join('\n');
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamId} 0 R >>`;
    objects[streamId] = `<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream`;
  });
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id++) { offsets[id] = Buffer.byteLength(pdf, 'ascii'); pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`; }
  const xref = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, 'ascii');
}

export function createSignedAgreementPdf(input: SignedPdfInput): Buffer {
  return buildPdf([
    'JUSTPREM | SIGNED RETREAT AGREEMENT', '', `Retreat: ${input.retreatName}`,
    `Participant: ${input.participantName}`, `Booking reference: ${input.bookingReference}`,
    `Agreement version: ${input.termsVersion}`, `Agreement reference: ${input.agreementReference}`,
    `Signed at (UTC): ${input.signedAt}`, '', input.termsSnapshot, '',
    `Electronic signature: ${input.participantName}`, input.acceptanceText,
    `Document integrity hash (SHA-256): ${input.documentHash}`,
  ]);
}
