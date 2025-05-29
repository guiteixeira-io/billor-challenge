import { Module } from '@nestjs/common';
// Make sure the file exists at the specified path, or update the path if needed
import { AutomationController } from './automation.controller';

@Module({
  controllers: [AutomationController],
})
export class AppModule {}