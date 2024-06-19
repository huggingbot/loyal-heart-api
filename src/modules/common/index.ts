import { Logger, logger } from '@/logger'

export interface IBaseServiceOptions {
  logger?: Logger
}

export class BaseService {
  protected name: string
  protected logger: Logger

  public constructor(name: string, options?: IBaseServiceOptions) {
    this.name = name
    this.logger = options?.logger || logger
  }

  protected logDebug(message: string, metadata?: Record<string, string>): void {
    this.logger.logServiceDebug(this.name, message, metadata)
  }

  protected logInfo(message: string, metadata?: Record<string, string>): void {
    this.logger.logServiceInfo(this.name, message, metadata)
  }

  protected logWarn(message: string, metadata?: Record<string, string>): void {
    this.logger.logServiceWarn(this.name, message, metadata)
  }

  protected logError(message: string, metadata?: Record<string, string>): void {
    this.logger.logServiceError(this.name, message, metadata)
  }
}
