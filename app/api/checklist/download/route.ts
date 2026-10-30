import { NextResponse } from 'next/server';
import { getChecklistPdfBuffer } from '@/lib/checklist-pdf';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pdfBuffer = getChecklistPdfBuffer();

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Foothills-Google-Maps-Setup-Checklist.pdf"',
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('Error serving checklist PDF:', err);
    return NextResponse.json({ error: 'Failed to download checklist.' }, { status: 500 });
  }
}
