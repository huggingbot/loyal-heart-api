import { ApiError } from '../../errors'

export class UserServiceException extends ApiError {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}

export class UserValidationError extends UserServiceException {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}
