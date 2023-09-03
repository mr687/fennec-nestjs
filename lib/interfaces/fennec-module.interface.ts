import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export type FennecModuleOptions = {
  /** Fennec API URL */
  url: string;
  /** Fennec API email */
  username: string;
  /** Fennec API secretKey */
  key: string;
  /** Fennec Session ID */
  sessionId: string;

  otp?: {
    /** OTP length */
    length?: number;
  }
};

export interface FennecModuleOptionsFactory {
  createFennecModuleOptions():
    | Promise<FennecModuleOptions>
    | FennecModuleOptions;
}

export interface FennecModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<FennecModuleOptionsFactory>;
  useClass?: Type<FennecModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<FennecModuleOptions> | FennecModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
