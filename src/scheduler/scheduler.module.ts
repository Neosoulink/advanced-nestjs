import { Module } from '@nestjs/common';
import { InternalScheduler } from './interval.scheduler/interval.scheduler';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  providers: [InternalScheduler],
})
export class SchedulerModule {}
