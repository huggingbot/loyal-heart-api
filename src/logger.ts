import winston from 'winston'

import { getSgDateString } from './utils/date'

// import { maskAllEmailAddress } from './masking'

export class Logger {
  private logger: winston.Logger

  public constructor() {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      handleExceptions: true,
      format: winston.format.combine(winston.format.timestamp({ format: () => getSgDateString() }), winston.format.printf(formatLogMessage)),
      transports: [new winston.transports.Console()],
    })
  }

  public setLevel(level: string): void {
    this.logger.level = level
  }

  public debug(message: string, metadata?: unknown): void {
    this.logger.debug(formatGenericLogSuffix(message, metadata))
  }

  public info(message: string, metadata?: unknown): void {
    this.logger.info(formatGenericLogSuffix(message, metadata))
  }

  public warn(message: string, metadata?: unknown): void {
    this.logger.warn(formatGenericLogSuffix(message, metadata))
  }

  public error(message: string, metadata?: unknown): void {
    this.logger.error(formatGenericLogSuffix(message, metadata))
  }

  public logHttp(message: string, metadata?: unknown): void {
    this.logger.info(formatHttpLogSuffix(message, metadata))
  }

  public logServiceDebug(name: string, message: string, metadata?: unknown): void {
    this.logger.debug(formatServiceLogSuffix(name, message, metadata))
  }

  public logServiceInfo(name: string, message: string, metadata?: unknown): void {
    this.logger.info(formatServiceLogSuffix(name, message, metadata))
  }

  public logServiceWarn(name: string, message: string, metadata?: unknown): void {
    this.logger.warn(formatServiceLogSuffix(name, message, metadata))
  }

  public logServiceError(name: string, message: string, metadata?: unknown): void {
    this.logger.error(formatServiceLogSuffix(name, message, metadata))
  }

  public logTransactionSuccess(name: string, metadata?: unknown): void {
    this.logger.info(formatTransactionLogSuffix(name, 'SUCCESS', metadata))
  }

  public logTransactionFailure(name: string, metadata?: unknown): void {
    this.logger.error(formatTransactionLogSuffix(name, 'FAILURE', metadata))
  }
}

const formatGenericLogSuffix = (message: string, metadata?: unknown): string => {
  return `[GENERIC] [${message}] [${metadata ? JSON.stringify(metadata) : '-'}]`
}

const formatHttpLogSuffix = (message: string, metadata?: unknown): string => {
  return `[HTTP] [${message}] [${metadata ? JSON.stringify(metadata) : '-'}]`
}

const formatServiceLogSuffix = (name: string, message: string, metadata?: unknown): string => {
  return `[SERVICE] [${name.toUpperCase()}] [${message}] [${metadata ? JSON.stringify(metadata) : '-'}]`
}

const formatTransactionLogSuffix = (name: string, status: string, metadata?: unknown): string => {
  return `[TRANS] [${name.toUpperCase()}] [${status.toUpperCase()}] [${metadata ? JSON.stringify(metadata) : '-'}]`
}

const formatLogMessage = (info: winston.Logform.TransformableInfo): string => {
  const { level, message, timestamp } = info
  const msg = `[${String(timestamp)}] [${level.toUpperCase()}] ${String(message)}`
  // return maskAllEmailAddress(msg)
  return msg
}

export const logger = new Logger()
