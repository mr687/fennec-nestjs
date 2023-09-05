export type FennecApiResponse<TData = any> = {
  data: TData;
  metadata: {
    status: number;
    statusCode: number;
    message: string;
  };
};

export type FennecApiRequest = {
  receiver: string;
};

export type SendOtpResponse = FennecApiResponse<{
  jobId: string;
  receiver: string;
  content: string;
  status: 'QUEUED';
}>;

export type SendCustomMessageRequest = FennecApiRequest & {
  content: string;
};

export type SendCustomMessageResponse = {
  jobId: string;
  receiver: string;
  message: any;
  status: 'QUEUED';
};
