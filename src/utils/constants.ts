// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Roles
export const ROLES = {
  ADMIN: 'admin',
  ARTIST: 'artist',
  USER: 'user',
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
};

// Event types
export const EVENT_TYPES = {
  CONCERT: 'concert',
  WEDDING: 'wedding',
  CORPORATE: 'corporate',
  FESTIVAL: 'festival',
  PRIVATE: 'private',
  OTHER: 'other',
};

// Default pagination values
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}; 