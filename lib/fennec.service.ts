import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { FENNEC_MODULE_OPTIONS } from './fennec.constants';
import {
  FennecModuleOptions,
  SendCustomMessageRequest,
  SendCustomMessageResponse,
  SendOtpResponse,
} from './interfaces';
import { randomOtpCode } from './utils';
import { AxiosError } from 'axios';

@Injectable()
export class FennecService {
  protected readonly FENNEC_ENDPOINTS = {
    SEND_OTP: '/modules/chat-bot/sendOtp',
    SEND_CUSTOM_MESSAGE: '/modules/chat-bot/sendCustomMessage',
  };

  constructor(
    @Inject(FENNEC_MODULE_OPTIONS)
    protected readonly options: FennecModuleOptions,
    protected readonly http: HttpService,
  ) {
    const { url, username, key } = options;
    this.http.axiosRef.defaults.baseURL = url;
    this.http.axiosRef.defaults.headers.common[
      'Authorization'
    ] = `Basic ${Buffer.from(`${username}:${key}`).toString('base64')}`;
  }

  async sendOtp(phone: string, otp?: string) {
    otp = otp ?? randomOtpCode(this.options.otp?.length);
    this.http
      .post<SendOtpResponse>(this.FENNEC_ENDPOINTS.SEND_OTP, {
        sessionId: this.options.sessionId,
        receiver: phone,
        code: +otp,
      })
      .subscribe({
        error: (err: AxiosError) => {
          console.error('Fennec API Error:sendOtp', {
            url: err.config?.url,
            data: err.config?.data,
            status: err.status,
            message: err.message,
          });
        },
      });
    return 'OK';
  }

  async sendCustomMessage({
    receiver,
    content: contentText,
  }: SendCustomMessageRequest) {
    this.http
      .post<SendCustomMessageResponse>(
        this.FENNEC_ENDPOINTS.SEND_CUSTOM_MESSAGE,
        {
          sessionId: this.options.sessionId,
          receiver: receiver,
          content: {
            text: contentText,
          },
        },
      )
      .subscribe({
        error: (err: AxiosError) => {
          console.error('Fennec API Error:sendCustomMessage', {
            url: err.config?.url,
            data: err.config?.data,
            status: err.status,
            message: err.message,
          });
        },
      });
    return 'OK';
  }
}
