import puppeteer from 'puppeteer';
import MarkdownIt from 'markdown-it';
import fs from 'fs';
import path from 'path';

async function generatePDF() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync('PROJECT_SUMMARY.md', 'utf8');
    
    // Initialize markdown parser
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
    
    // Convert markdown to HTML
    const htmlContent = md.render(markdownContent);
    
    // Create complete HTML document with styling
    const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Mimi Waitress - Project Summary</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: #fff;
            }
            h1 {
                color: #8b795e;
                border-bottom: 3px solid #ffe6b0;
                padding-bottom: 10px;
                font-size: 2.5em;
                margin-bottom: 30px;
            }
            h2 {
                color: #8b795e;
                border-bottom: 2px solid #ffe6b0;
                padding-bottom: 8px;
                margin-top: 40px;
                margin-bottom: 20px;
                font-size: 1.8em;
            }
            h3 {
                color: #8b795e;
                margin-top: 30px;
                margin-bottom: 15px;
                font-size: 1.4em;
            }
            h4 {
                color: #8b795e;
                margin-top: 25px;
                margin-bottom: 12px;
                font-size: 1.2em;
            }
            p {
                margin-bottom: 15px;
                text-align: justify;
            }
            ul, ol {
                margin-bottom: 20px;
                padding-left: 30px;
            }
            li {
                margin-bottom: 8px;
            }
            strong {
                color: #8b795e;
                font-weight: 600;
            }
            code {
                background: #ffe6b0;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                color: #8b795e;
            }
            pre {
                background: #ffe6b0;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                margin: 20px 0;
            }
            blockquote {
                border-left: 4px solid #ffe6b0;
                padding-left: 20px;
                margin: 20px 0;
                font-style: italic;
                color: #666;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background: #ffe6b0;
                color: #8b795e;
                font-weight: 600;
            }
            .page-break {
                page-break-before: always;
            }
            hr {
                border: none;
                border-top: 2px solid #ffe6b0;
                margin: 40px 0;
            }
            @media print {
                body {
                    max-width: none;
                    margin: 0;
                    padding: 20px;
                }
                .page-break {
                    page-break-before: always;
                }
            }
        </style>
    </head>
    <body>
        ${htmlContent}
    </body>
    </html>
    `;
    
    // Launch Puppeteer
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and generate PDF
    console.log('Generating PDF...');
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    await browser.close();
    
    // Save PDF file
    const outputPath = 'Mimi_Waitress_Project_Summary.pdf';
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`✓ PDF generated successfully: ${outputPath}`);
    console.log(`File size: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    
    return outputPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Run the function
generatePDF().catch(console.error);