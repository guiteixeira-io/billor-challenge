const puppeteer = require('puppeteer');

test('Página deve ter um título', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.example.com');
    const title = await page.title();

    expect(title).toBeDefined();

    await browser.close();
});