import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor() {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'notification',
  })
  async generateReport() {
    try {
      this.logger.error('error...');
      console.log('generating report...');
    } catch (error) {
      console.log(error);
    }
  }

  //   @Interval(30000)
  //   async generateReportUsingInterval() {
  //     this.logger.warn('Interval...');
  //   }
}
