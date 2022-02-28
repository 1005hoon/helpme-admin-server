import { Controller, Get, Query } from '@nestjs/common';
import { CorpsService } from './corps.service';

@Controller('corps')
export class CorpsController {
  constructor(private readonly corpsService: CorpsService) {}

  @Get('/expirations')
  getExpiringRepsAndClientsForDate(
    @Query('from') from: string,
    @Query('days') days: number = 1,
  ) {
    return this.corpsService.getExpiringRepsAndClientsForDate(from, days);
  }
}
