/**
 * Custom error class for API responses
 * Makes it easier to create consistent error responses with appropriate status codes
 */
class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    
    // This captures the proper this context
    Object.setPrototypeOf(this, ErrorResponse.prototype);
    
    // Maintains proper stack trace for debugging (available in V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }
  }
}

export default ErrorResponse; 