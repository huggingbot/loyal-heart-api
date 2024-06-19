import { ApiError } from '../../errors'

export class UserCouponServiceException extends ApiError {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}

export class UserCouponValidationError extends UserCouponServiceException {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}
