export class ApiError extends Error {
  metadata?: Record<string, unknown>

  public constructor(message: string, metadata?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.metadata = metadata
  }
}

export class UserAuthorizationError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class UnexpectedError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
