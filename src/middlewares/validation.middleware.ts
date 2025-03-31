import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false, 
      errors: errors.array().map(error => {
        // Check if error has msg property and safely extract field info
        return {
          field: 'path' in error ? error.path : 
                 'param' in error ? error.param : 
                 'type' in error ? error.type : 'unknown',
          message: error.msg
        };
      }) 
    });
    return;
  }
  next();
}; 