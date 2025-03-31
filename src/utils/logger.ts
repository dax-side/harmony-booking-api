/**
 * Simple logger utility for consistent console logging
 * This could be expanded to use a proper logging library like Winston in production
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const isDev = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log info messages
   */
  info: (message: string, obj?: any): void => {
    if (isDev) {
      if (obj) {
        console.log(`${colors.blue}INFO:${colors.reset} ${message}`, obj);
      } else {
        console.log(`${colors.blue}INFO:${colors.reset} ${message}`);
      }
    }
  },

  /**
   * Log success messages
   */
  success: (message: string, obj?: any): void => {
    if (isDev) {
      if (obj) {
        console.log(`${colors.green}SUCCESS:${colors.reset} ${message}`, obj);
      } else {
        console.log(`${colors.green}SUCCESS:${colors.reset} ${message}`);
      }
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, obj?: any): void => {
    if (obj) {
      console.log(`${colors.yellow}WARNING:${colors.reset} ${message}`, obj);
    } else {
      console.log(`${colors.yellow}WARNING:${colors.reset} ${message}`);
    }
  },

  /**
   * Log error messages
   */
  error: (message: string, error?: any): void => {
    if (error) {
      console.error(`${colors.red}ERROR:${colors.reset} ${message}`, error);
    } else {
      console.error(`${colors.red}ERROR:${colors.reset} ${message}`);
    }
  },

  /**
   * Log database-related messages
   */
  db: (message: string, obj?: any): void => {
    if (isDev) {
      if (obj) {
        console.log(`${colors.cyan}DATABASE:${colors.reset} ${message}`, obj);
      } else {
        console.log(`${colors.cyan}DATABASE:${colors.reset} ${message}`);
      }
    }
  },
};

export default logger; 