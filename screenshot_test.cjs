const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5176/home', {waitUntil: 'networkidle2'});
  
  // click toggle to bypass onboarding or just wait
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'test_home.png', fullPage: true });
  console.log('Saved test_home.png');
  
  await browser.close();
})();
