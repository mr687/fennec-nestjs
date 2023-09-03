import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  FennecModuleAsyncOptions,
  FennecModuleOptions,
  FennecModuleOptionsFactory,
} from './interfaces';
import { FENNEC_MODULE_OPTIONS } from './fennec.constants';
import { HttpModule } from '@nestjs/axios';
import { FennecService } from './fennec.service';

@Module({
  imports: [HttpModule],
  providers: [FennecService],
  exports: [FennecService],
})
export class FennecModule {
  static register(options: FennecModuleOptions): DynamicModule {
    return {
      module: FennecModule,
      providers: [
        {
          provide: FENNEC_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static registerAsync(options: FennecModuleAsyncOptions): DynamicModule {
    return {
      module: FennecModule,
      imports: [...(options.imports || [])],
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: FennecModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FennecModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FENNEC_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: FENNEC_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FennecModuleOptionsFactory) =>
        await optionsFactory.createFennecModuleOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
