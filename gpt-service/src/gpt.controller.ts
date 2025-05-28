import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('summarize-loads')
export class GptController {
  @Post()
  async summarize(@Body() data: any): Promise<any> {
    const response = await axios.post('URL_DA_API_GPT', { prompt: JSON.stringify(data) });
    return response.data;
  }
}