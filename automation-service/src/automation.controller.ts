import { Controller, Get } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Controller('automation')
export class AutomationController {
  @Get()
  async extractData(): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.example.com');
    
    const title = await page.title();
    await browser.close();
    
    return `Título da página: ${title}`;
  }
}