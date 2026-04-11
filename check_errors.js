import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('request', request => {
    console.log('>>', request.method(), request.url());
  });
  page.on('response', response => {
    console.log('<<', response.status(), response.url());
  });
  
  await page.goto('http://localhost:5174/auth', { waitUntil: 'networkidle0' });
  
  await page.type('input[type="text"]', 'Test User');
  await page.type('input[type="email"]', 'test_freeze_231@example.com');
  const passwordInputs = await page.$$('input[type="password"]');
  await passwordInputs[0].type('password123');
  await passwordInputs[1].type('password123');
  
  await page.click('button[type="submit"]');
  
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
})();
