test('Página deve ter um título', async () => {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.example.com');
    expect(await page.title()).toBeDefined();
    
    await browser.close();
});