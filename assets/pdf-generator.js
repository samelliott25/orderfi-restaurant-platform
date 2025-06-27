import MarkdownIt from 'markdown-it';
import fs from 'fs';

async function generateHTMLForPDF() {
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
    
    // Create complete HTML document with professional styling
    const fullHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Mimi Waitress - Project Summary</title>
        <style>
            @media print {
                body { margin: 0; }
                .page-break { page-break-before: always; }
            }
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
                text-align: center;
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
            hr {
                border: none;
                border-top: 2px solid #ffe6b0;
                margin: 40px 0;
            }
            .header-info {
                background: #ffe6b0;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                text-align: center;
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }
            .metric-card {
                background: #ffe6b0;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
            }
            .footer {
                margin-top: 50px;
                padding: 20px;
                background: #ffe6b0;
                border-radius: 10px;
                text-align: center;
                color: #8b795e;
            }
        </style>
    </head>
    <body>
        <div class="header-info">
            <h1 style="margin: 0; border: none; color: #8b795e;">Mimi Waitress</h1>
            <p style="margin: 10px 0 0 0; font-size: 1.2em; color: #8b795e;"><strong>AI Restaurant Platform - Project Summary</strong></p>
            <p style="margin: 5px 0 0 0; color: #8b795e;">Generated: June 19, 2025 | Development Time: 3 Days</p>
        </div>
        
        ${htmlContent}
        
        <div class="footer">
            <p><strong>Mimi Waitress AI Restaurant Platform</strong></p>
            <p>Blockchain-Powered • AI-Driven • Production-Ready</p>
            <p>Generated on June 19, 2025</p>
        </div>
    </body>
    </html>
    `;
    
    // Save HTML file
    const outputPath = 'Mimi_Waitress_Project_Summary.html';
    fs.writeFileSync(outputPath, fullHTML);
    
    console.log(`✓ HTML file generated: ${outputPath}`);
    console.log('To convert to PDF:');
    console.log('1. Open the HTML file in your browser');
    console.log('2. Press Ctrl+P (or Cmd+P on Mac)');
    console.log('3. Select "Save as PDF" as destination');
    console.log('4. Choose appropriate settings and save');
    
    return outputPath;
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
}

// Run the function
generateHTMLForPDF().catch(console.error);