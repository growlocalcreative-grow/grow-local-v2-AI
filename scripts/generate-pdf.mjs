import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateChecklistPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Standard US Letter: 8.5 x 11 inches = 612 x 792 points
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette matching Grow Local Creative
  const cDarkForest = rgb(0.176, 0.200, 0.157); // #2D3328
  const cSage = rgb(0.533, 0.608, 0.443);       // #889B70
  const cSageLight = rgb(0.910, 0.933, 0.875);  // #E8EEE0
  const cCardBg = rgb(0.976, 0.980, 0.969);     // light warm tint
  const cCardBorder = rgb(0.87, 0.88, 0.85);
  const cTextDark = rgb(0.12, 0.14, 0.11);
  const cTextMuted = rgb(0.35, 0.38, 0.34);
  const cTextBody = rgb(0.20, 0.22, 0.19);
  const cWhite = rgb(1, 1, 1);
  const cAmber = rgb(0.82, 0.52, 0.18);

  const marginX = 40;
  const contentWidth = width - marginX * 2; // 532 pt

  // Top header banner background
  page.drawRectangle({
    x: 0,
    y: height - 106,
    width: width,
    height: 106,
    color: cDarkForest,
  });

  // Top Accent Stripe
  page.drawRectangle({
    x: 0,
    y: height - 6,
    width: width,
    height: 6,
    color: cSage,
  });

  // Small Top Badge
  page.drawRectangle({
    x: marginX,
    y: height - 32,
    width: 260,
    height: 16,
    color: rgb(0.27, 0.31, 0.24),
    borderColor: cSage,
    borderWidth: 0.5,
  });
  page.drawText('GROW LOCAL CREATIVE  •  FOOTHILL ACTION GUIDE', {
    x: marginX + 8,
    y: height - 28,
    size: 7.5,
    font: fontBold,
    color: cSageLight,
  });

  // Document Title
  page.drawText('5-Minute Google Maps Setup Checklist', {
    x: marginX,
    y: height - 58,
    size: 20,
    font: fontBold,
    color: cWhite,
  });

  // Subtitle
  page.drawText('How Cool, Auburn, Placerville & Divide businesses get found by local neighbors first.', {
    x: marginX,
    y: height - 76,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.85, 0.88, 0.82),
  });

  // Meta bar under header
  page.drawText('Printable 1-Page Cheatsheet  |  No Tech Jargon  |  Updated for 2026', {
    x: marginX,
    y: height - 94,
    size: 8,
    font: fontOblique,
    color: rgb(0.70, 0.75, 0.68),
  });

  // Step definition helper
  let currentY = height - 120;

  const steps = [
    {
      num: 'STEP 1',
      title: 'Fix the Rural Address Dilemma (P.O. Boxes vs. Home Offices)',
      points: [
        {
          bold: 'Never list a P.O. Box:',
          text: 'Google algorithms suspend listings using P.O. Boxes or UPS Stores. Use your actual residence or shop.',
        },
        {
          bold: 'Hide your home address:',
          text: 'If you serve customers at their homes/sites, check "I deliver goods and services" and toggle street address to hidden.',
        },
        {
          bold: 'Designate specific Foothill service areas:',
          text: 'Add explicit cities: Cool (95614), Georgetown (95634), Auburn, Placerville, Greenwood, Pilot Hill, Coloma, Lotus.',
        },
      ],
    },
    {
      num: 'STEP 2',
      title: 'Lock In High-Intent Primary & Secondary Categories',
      points: [
        {
          bold: 'Primary Category is 60%+ of ranking weight:',
          text: 'Avoid generic tags like "Service" or "Contractor". Use specific terms like "Electrician", "Tree Service", "Bakery".',
        },
        {
          bold: 'Add 3-5 precise secondary categories:',
          text: 'E.g., for BBQ: Primary "Barbecue restaurant", Secondary: "Caterer", "Takeout restaurant", "Family restaurant".',
        },
        {
          bold: 'Spy on the #1 competitor:',
          text: 'Search your trade in Auburn or Placerville on Google Maps. Notice the exact category badge under their name.',
        },
      ],
    },
    {
      num: 'STEP 3',
      title: 'Upload Real Local Photos (Google Loves Local Proof)',
      points: [
        {
          bold: 'Skip stock photography entirely:',
          text: 'Google detects stock images and demotes them. Real phone photos get 3x higher click-throughs.',
        },
        {
          bold: 'The Essential 5 Photos:',
          text: '1) Your branded truck/trailer or shop sign on Hwy 49, 2) You/crew smiling, 3) 2-3 clean job-site or food results.',
        },
        {
          bold: 'Natural GPS Geotagging:',
          text: 'Take photos with your phone camera location enabled. Google reads the Foothills metadata automatically.',
        },
      ],
    },
    {
      num: 'STEP 4',
      title: 'Create Your Direct 1-Tap Google Review Shortlink',
      points: [
        {
          bold: 'Eliminate friction:',
          text: 'Never tell clients "Find us on Google". Open your profile -> click "Ask for reviews" -> copy your shortlink (g.page/r/...).',
        },
        {
          bold: 'The 30-Second Text Script:',
          text: '"Hey [Name]! Thanks for having us out today. If you have 30 secs, a Google review means the world to our family business: [LINK]"',
        },
        {
          bold: 'Keywords inside reviews count:',
          text: 'When happy locals mention "Cool", "Auburn", or "generator hookup", Google boosts your ranking for those words.',
        },
      ],
    },
    {
      num: 'STEP 5',
      title: 'The 60-Second Weekly "Google Post" Local Ranking Hack',
      points: [
        {
          bold: 'Keep the listing active:',
          text: 'Profiles with updates in the last 14 days get prioritized over dead profiles. Spend 60 seconds every Friday.',
        },
        {
          bold: 'The 2-Sentence Formula:',
          text: 'Upload 1 photo from this week + 2 sentences mentioning your town: "Wrapping up a custom metal roof out in Georgetown!"',
        },
        {
          bold: 'Zero ad spend needed:',
          text: 'Google feeds this fresh local activity directly into Google Maps search signals without paying for ads.',
        },
      ],
    },
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const boxHeight = 100;
    const boxY = currentY - boxHeight;

    // Card background
    page.drawRectangle({
      x: marginX,
      y: boxY,
      width: contentWidth,
      height: boxHeight,
      color: cCardBg,
      borderColor: cCardBorder,
      borderWidth: 0.75,
    });

    // Step badge pill
    page.drawRectangle({
      x: marginX + 10,
      y: boxY + boxHeight - 20,
      width: 52,
      height: 14,
      color: cDarkForest,
    });
    page.drawText(step.num, {
      x: marginX + 15,
      y: boxY + boxHeight - 16,
      size: 7.5,
      font: fontBold,
      color: cWhite,
    });

    // Step Title
    page.drawText(step.title, {
      x: marginX + 68,
      y: boxY + boxHeight - 17,
      size: 10,
      font: fontBold,
      color: cDarkForest,
    });

    // Points inside step
    let lineY = boxY + boxHeight - 36;
    for (const pt of step.points) {
      // Draw checkbox square
      page.drawRectangle({
        x: marginX + 12,
        y: lineY - 1,
        width: 8,
        height: 8,
        borderColor: cSage,
        borderWidth: 1,
        color: cWhite,
      });

      // Point text with bold prefix
      const boldPart = pt.bold + ' ';
      const boldWidth = fontBold.widthOfTextAtSize(boldPart, 8);
      
      page.drawText(boldPart, {
        x: marginX + 26,
        y: lineY,
        size: 8,
        font: fontBold,
        color: cTextDark,
      });

      // Calculate max text length fit
      const availableWidth = contentWidth - 36 - boldWidth;
      let textToDraw = pt.text;
      if (fontRegular.widthOfTextAtSize(textToDraw, 8) > availableWidth) {
        // truncate with ellipsis if too long
        while (textToDraw.length > 10 && fontRegular.widthOfTextAtSize(textToDraw + '...', 8) > availableWidth) {
          textToDraw = textToDraw.slice(0, -1);
        }
        textToDraw += '...';
      }

      page.drawText(textToDraw, {
        x: marginX + 26 + boldWidth,
        y: lineY,
        size: 8,
        font: fontRegular,
        color: cTextBody,
      });

      lineY -= 18;
    }

    currentY -= (boxHeight + 10);
  }

  // Bottom Callout Box (Grow Local Creative)
  const footerBoxHeight = 82;
  const footerBoxY = 28;

  page.drawRectangle({
    x: marginX,
    y: footerBoxY,
    width: contentWidth,
    height: footerBoxHeight,
    color: rgb(0.93, 0.95, 0.90),
    borderColor: cSage,
    borderWidth: 1,
  });

  // Footer Title
  page.drawText('NEED A HAND GETTING MORE CUSTOMERS FROM THE LOCAL FOOTHILLS?', {
    x: marginX + 16,
    y: footerBoxY + footerBoxHeight - 18,
    size: 9.5,
    font: fontBold,
    color: cDarkForest,
  });

  page.drawText(
    'Grow Local Creative builds clean, lightning-fast websites and sets up local search profiles for trade contractors,',
    {
      x: marginX + 16,
      y: footerBoxY + footerBoxHeight - 33,
      size: 8,
      font: fontRegular,
      color: cTextBody,
    }
  );

  page.drawText(
    'specialty shops, and eateries in Cool, Auburn, Placerville, and the Georgetown Divide. No corporate fluff, just real local results.',
    {
      x: marginX + 16,
      y: footerBoxY + footerBoxHeight - 45,
      size: 8,
      font: fontRegular,
      color: cTextBody,
    }
  );

  // Contact line
  page.drawRectangle({
    x: marginX + 16,
    y: footerBoxY + 10,
    width: contentWidth - 32,
    height: 18,
    color: cDarkForest,
  });

  page.drawText('CALL OR TEXT: (916) 869-4142   |   EMAIL: growlocalcreative@gmail.com   |   WEB: www.growlocalcreative.com', {
    x: marginX + 22,
    y: footerBoxY + 15,
    size: 7.5,
    font: fontBold,
    color: cWhite,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'foothills-google-maps-checklist.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Successfully generated PDF at:', outputPath, 'Bytes:', pdfBytes.length);
}

generateChecklistPDF().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
