const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.example.com');
    console.log(await page.title());
    
    await browser.close();
})();

require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const client = require('prom-client');

// Prometheus metrics setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const loginAndExtractData = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Login to first portal
        await page.goto('https://www.jbhunt.com/loadboard/load-board/map');
        await page.type('#username', process.env.JBHUNT_USER);
        await page.type('#password', process.env.JBHUNT_PASS);
        await page.click('#login-button');
        await page.waitForNavigation();

        // Extract loads from first portal
        const loads1 = await extractLoads(page);

        // Login to second portal
        await page.goto('https://www.landstaronline.com/loadspublic');
        await page.type('#username', process.env.LANDSTAR_USER);
        await page.type('#password', process.env.LANDSTAR_PASS);
        await page.click('#login-button');
        await page.waitForNavigation();

        // Extract loads from second portal
        const loads2 = await extractLoads(page);

        const allLoads = [...loads1, ...loads2].slice(0, 20);

        await sendDataToGPT(allLoads);

    } catch (error) {
        console.error('Process error:', error);
    } finally {
        await browser.close();
    }
};

// Function to extract loads
const extractLoads = async (page) => {
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('.load-row'); // Adjust selector as needed
        return Array.from(rows).map(row => ({
            origin: row.querySelector('.origin').innerText,
            destination: row.querySelector('.destination').innerText,
            price: row.querySelector('.price').innerText,
            eta: row.querySelector('.eta').innerText
        }));
    });
};

// Function to send data with retry logic
const sendDataToGPT = async (loads) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await axios.post(`${process.env.GPT_SERVICE_URL}/summarize-loads`, { loads });
            console.log('Data sent successfully!');
            return;
        } catch (error) {
            console.error(`Error sending data, attempt ${attempt + 1}`);
            attempt++;
            await new Promise(res => setTimeout(res, 2000 * attempt)); // Exponential backoff
        }
    }
};

// Expose Prometheus metrics
const express = require('express');
const app = express();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3001, () => console.log('Metrics available at http://localhost:3001/metrics'));

// Start login and extraction process
loginAndExtractData();