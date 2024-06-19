import express from 'express'

import { Logger, logger } from '@/logger'

export interface IBaseControllerOptions {
  logger?: Logger
}

interface ILogContext {
  request: {
    params: unknown
    query: unknown
    body: unknown
  }
  metadata: {
    requestId: string
    sourceIp: string
  }
  data: unknown
}

export class BaseController {
  protected name: string
  protected logger: Logger

  public constructor(name: string, options?: IBaseControllerOptions) {
    this.name = name
    this.logger = options?.logger || logger
  }

  protected logSuccess(req: express.Request, metadata?: unknown): void {
    this.logger.logTransactionSuccess(this.name, this.generateLogContext(req, metadata))
  }

  protected logFailure(req: express.Request, metadata?: unknown): void {
    this.logger.logTransactionFailure(this.name, this.generateLogContext(req, metadata))
  }

  protected generateLogContext(req: express.Request, metadata?: unknown): ILogContext {
    return {
      request: {
        params: req.params,
        query: req.query,
        body: req.body,
      },
      metadata: {
        requestId: req.context.requestId,
        sourceIp: req.context.sourceIp,
      },
      data: metadata,
    }
  }
}
