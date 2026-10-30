// Pre-rendered, production-ready 1-page PDF for 5-Minute Google Maps Setup Checklist
// Inlined as base64 to eliminate any node:fs / disk filesystem dependency on Cloudflare Workers / Edge runtime.

const CHECKLIST_PDF_BASE64 = 
  "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" +
  "i7X5D2GUf4IKZW5kc3RyZWFtCmVuZG9iagoKOSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQov" +
  "VHlwZSAvT2JqU3RtCi9OIDcKL0ZpcnN0IDQxCi9MZW5ndGggNzc5Cj4+CnN0cmVhbQp4nNVW24ocNxB9" +
  "76/QY/JgWnVRVSksC3ubBIKxsQ0JDnmYnWmWCUu3PdMTnL9PqWfXxrsShpAXM4hpSedIdTklCUIMGJgD" +
  "BbXAIRGGFBCUgwREgaABiSmcnXX9u38+DKF/vb4bDl3/6257CH84JYY34c+uv5qO4xygOz/vvmCv1vP6" +
  "frrrTqQABfyIeL2ftsfNsA9nq5vVKkaNMQp7kxjx2v+vvGVv6H2fQ/Nvb8oPzceUYqQLn1udmuiJU+YX" +
  "bHrg3/i/Y6Vgrk9YtlP/875lr5vTGvgte/J517+cttfreQg/XP+E0UMVKYICYX7/o4djP6zn6ft1brF/" +
  "N41ND7/Kc0lvSfJ+KBpYsty/GQ7Tcb/xtBfcavKZ8vHLcP/3MO826xeX0/32hcZsbqxadt0tvCeArIxi" +
  "mMSep0rkLKZs4mp9Mvfq9n738Tg4P0WWjFFdyrUNNCkmIvFF6hYYpwgWwVdoAMRNUDCtmJgMWQSJ7LmJ" +
  "Cxnc/YQMmp6T1cwygGe3Qc6aiTljJXio0SDnnCqxWbguBXcaRbjhllJKktmabqtxhKQAzwFZxIiIc8ty" +
  "TG4eRq5sDqh+DKH5UVTnqmL0DTBXQsbJV1ZUaZHdJ7JEEivkBcDmheCyTC1Fqk+VtBpWog5CmjORNrZ3" +
  "FuccESvkVJTGmiW2HE8ZPeaOqpBdLOR11Ey3gOfKPOkNtzxhvn70+m4BkBKLSq4AXEaeTgbJLZmDSSkh" +
  "rFSZi9AEysnTIitRTJGsohYEYPGkWqvAxHd2kfsB2XR8iUumSvmeqiyRSQl8BQAEUnJG3BQrEUBOtRr1" +
  "AkoYjamVNHQ1KylwxXbImCAmhgaX/FRJxLXqdKWwCptVhKYEiOp2tZLhi3o4VOhRBn4T9L+/uv1r2Cwn" +
  "fOnefJp/fjuXq+M0UMZeDtvd+nL65I+G6D9PeNCM5elwMY7TXB4TyzNinP0SKT17eFp8ddOUe6Tr3x5v" +
  "56VbBqHrL9eHYblhnhjrloybabsb70L/2268GA+7x4H/uOz/v+LjTfWNlf8FaXOEjAplbmRzdHJlYW0K" +
  "ZW5kb2JqCgoxMCAwIG9iago8PAovU2l6ZSAxMQovUm9vdCAyIDAgUgovSW5mbyAzIDAgUgovRmlsdGVy" +
  "IC9GbGF0ZURlY29kZQovVHlwZSAvWFJlZgovTGVuZ3RoIDQ1Ci9XIFsgMSAyIDIgXQovSW5kZXggWyAw" +
  "IDExIF0KPj4Kc3RyZWFtCnicFcS5DQAgDATBPfNIBEjuh5bp0XATDFAVLHBy4ZrrbrgpErTPLy88eFcD" +
  "eAplbmRzdHJlYW0KZW5kb2JqCgpzdGFydHhyZWYKNDI2OAolJUVPRg==";

let cachedBuffer: Uint8Array | null = null;

/**
 * Returns the binary Buffer / Uint8Array of the official 1-page PDF.
 * Decoded directly in memory without requiring Node.js file system APIs,
 * making it 100% compatible with Cloudflare Workers isolates, Edge runtimes,
 * and standard Node servers.
 */
export function getChecklistPdfBuffer(): Uint8Array {
  if (cachedBuffer) {
    return cachedBuffer;
  }

  // Cross-environment Base64 decode (Buffer if available, otherwise atob)
  if (typeof Buffer !== 'undefined') {
    cachedBuffer = new Uint8Array(Buffer.from(CHECKLIST_PDF_BASE64, 'base64'));
  } else {
    const binaryString = atob(CHECKLIST_PDF_BASE64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    cachedBuffer = bytes;
  }

  return cachedBuffer;
}
