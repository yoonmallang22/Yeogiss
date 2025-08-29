export type ApiResponse<T> = {
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
};
