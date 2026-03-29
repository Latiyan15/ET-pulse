const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  await page.goto('http://localhost:5174/login', {waitUntil: 'networkidle0'});
  
  // click toggle to go to Login tab
  const authToggleBtn = await page.$('.auth-toggle button');
  if (authToggleBtn) await authToggleBtn.click();
  
  await page.type('input[name="email"]', 'test@example.com');
  await page.type('input[name="password"]', 'password123');
  
  console.log('Clicking submit...');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(500);
  const btnHtml = await page.$eval('button[type="submit"]', el => el.outerHTML);
  console.log('Button HTML after 500ms:', btnHtml);
  
  await page.waitForTimeout(1000);
  console.log('Final URL:', page.url());
  
  await browser.close();
})();
