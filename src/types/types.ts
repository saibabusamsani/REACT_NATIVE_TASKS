export type ApiResponse<T> = {
  status: boolean;
  message: string;
  response: T;
};

export class ApiBusinessError extends Error {
  constructor(message: string, public raw?: unknown) {
    super(message);
    this.name = 'ApiBusinessError';
  }
}