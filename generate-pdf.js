const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('Opening new page...');
  // Create a new page
  const page = await browser.newPage();
  
  console.log('Reading HTML file...');
  // Get the HTML content from the file
  const htmlPath = path.join(__dirname, 'invoice.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  console.log('Setting content to page...');
  // Set the HTML content to the page
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });
  
  console.log('Setting page format...');
  // Set the PDF format
  const pdfOptions = {
    path: 'invoice.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    }
  };
  
  console.log('Generating PDF...');
  // Generate the PDF
  await page.pdf(pdfOptions);
  
  console.log('Closing browser...');
  // Close the browser
  await browser.close();
  
  console.log('PDF generated successfully at invoice.pdf');
})().catch(error => {
  console.error('An error occurred:', error);
});