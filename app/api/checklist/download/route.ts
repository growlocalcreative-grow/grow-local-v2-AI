import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'downloads', 'foothills-google-maps-checklist.pdf');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Checklist file not found.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Foothills-Google-Maps-Setup-Checklist.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Error serving checklist PDF:', err);
    return NextResponse.json({ error: 'Failed to download checklist.' }, { status: 500 });
  }
}
