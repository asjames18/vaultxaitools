import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Extend Express Request interface to include validatedBody
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
    }
  }
}

/**
 * Validation middleware that uses Zod schemas
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate req.body against the schema
      const validatedData = schema.parse(req.body);
      
      // Assign the validated data to req.validatedBody
      req.validatedBody = validatedData;
      
      // Continue to the next middleware/route handler
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Return validation errors
        return res.status(400).json({ error: error.issues });
      }
      
      // Handle unexpected errors
      return res.status(500).json({ error: 'Validation error occurred' });
    }
  };
} 