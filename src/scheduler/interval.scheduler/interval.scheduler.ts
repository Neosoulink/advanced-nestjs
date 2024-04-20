import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from '../decorators/interval-host.decorator';
import { INTERVAL_KEY } from '../decorators/interval.decorator';

@Injectable()
export class InternalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly _intervals: NodeJS.Timeout[] = [];

  constructor(
    private readonly _discoveryService: DiscoveryService,
    private readonly _reflector: Reflector,
    private readonly _metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    const providers = this._discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);

      if (!instance || !prototype) return;

      const isIntervalHost =
        this._reflector.get(INTERVAL_HOST_KEY, instance.constructor) ?? false;

      if (!isIntervalHost) return;

      const methodsKeys = this._metadataScanner.getAllMethodNames(prototype);

      methodsKeys.forEach((methodKey) => {
        const interval: number = this._reflector.get(
          INTERVAL_KEY,
          instance[methodKey],
        );
        if (!interval) return;

        const intervalRef = setInterval(() => instance[methodKey](), interval);
        this._intervals.push(intervalRef);
      });
    });
  }

  onApplicationShutdown() {
    this._intervals.forEach((intervalRef) => clearInterval(intervalRef));
  }
}
