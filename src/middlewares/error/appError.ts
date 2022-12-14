export class AppError extends Error {
  private readonly _statusCode: number;
  private readonly _reason: Reasons;
  private readonly _data: unknown[] = [];

  constructor(message: string, statusCode: number, reason: Reasons) {
    super(message);
    this._statusCode = statusCode;
    this._reason = reason;
  }

  public get message(): string {
    return super.message;
  }

  public get statusCode(): number {
    return this._statusCode;
  }

  public get reason(): Reasons {
    return this._reason;
  }

  public get data(): unknown[] {
    return this._data;
  }

  addData(data: Record<string, unknown>): AppError {
    this._data.push(data);
    return this;
  }

  toJson() {
    return {
      message: this.message,
      reason: this.reason,
      data: this.data,
      statusCode: this.statusCode
    };
  }
}

export enum Reasons {
  InvalidRequest = 'Invalidrequest',
  ResourceNotFound = 'ResourceNotFound',
  ResourceAlreadyExists = 'ResourceAlreadyExists',
  Unauthorized = 'Unauthorized'
}
