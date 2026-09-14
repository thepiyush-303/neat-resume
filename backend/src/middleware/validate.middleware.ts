import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Express middleware that validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (typed) result.
 * On failure, throws a ZodError caught by the global error handler.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}
