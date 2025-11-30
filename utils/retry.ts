/**
 * Retry utility for API calls with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'retryCondition' | 'onRetry'>> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Default retry condition: retry on network errors or 5xx status codes
 */
const defaultRetryCondition = (error: any): boolean => {
  // Network errors
  if (!error.response && error.message) {
    return true;
  }
  
  // Server errors (5xx)
  if (error.response?.status >= 500 && error.response?.status < 600) {
    return true;
  }
  
  // Rate limiting (429)
  if (error.response?.status === 429) {
    return true;
  }
  
  return false;
};

/**
 * Sleep utility
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Calculate delay with exponential backoff
 */
const calculateDelay = (
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number => {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
  return Math.min(delay, maxDelay);
};

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 * @throws The last error if all retries fail
 * 
 * @example
 * ```typescript
 * const result = await retry(
 *   () => fetch('/api/data'),
 *   {
 *     maxRetries: 3,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error)
 *   }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    retryCondition = defaultRetryCondition,
    onRetry,
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if we've exhausted all attempts
      if (attempt > maxRetries) {
        break;
      }

      // Don't retry if condition says not to
      if (!retryCondition(error)) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier);

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt, error);
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  // All retries failed, throw the last error
  throw lastError;
}

/**
 * Retry with custom error handling and user-friendly messages
 */
export async function retryWithErrorHandling<T>(
  fn: () => Promise<T>,
  options: RetryOptions & {
    errorMessage?: string;
    onError?: (error: any) => void;
  } = {}
): Promise<T> {
  const { errorMessage, onError, ...retryOptions } = options;

  try {
    return await retry(fn, retryOptions);
  } catch (error: any) {
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }

    // Create user-friendly error message
    const friendlyMessage = errorMessage || getFriendlyErrorMessage(error);
    
    // Create new error with friendly message
    const friendlyError = new Error(friendlyMessage);
    (friendlyError as any).originalError = error;
    
    throw friendlyError;
  }
}

/**
 * Get user-friendly error message from error object
 */
function getFriendlyErrorMessage(error: any): string {
  // Network errors
  if (!error.response) {
    if (error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // HTTP status codes
  const status = error.response?.status;
  
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'You are not authorized. Please log in and try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Our team has been notified. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again in a few moments.';
    default:
      return error.response?.data?.message || error.message || 'An error occurred. Please try again.';
  }
}

