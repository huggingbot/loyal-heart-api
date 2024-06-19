import { ApiError } from '../../errors'

export class CouponServiceException extends ApiError {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}

export class CouponValidationError extends CouponServiceException {
  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata)
    this.name = this.constructor.name
  }
}
