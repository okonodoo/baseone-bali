/**
 * Odoo Error Handling & Recovery
 * Provides typed error classes and recovery strategies
 */

/**
 * Base Odoo error class
 */
export class OdooError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "OdooError";
  }
}

/**
 * Authentication failed (invalid credentials, expired token)
 */
export class OdooAuthError extends OdooError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "AUTH_FAILED", context);
    this.name = "OdooAuthError";
  }
}

/**
 * Connection failed (network, timeout, server down)
 */
export class OdooConnectionError extends OdooError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "CONNECTION_FAILED", context);
    this.name = "OdooConnectionError";
  }
}

/**
 * Data validation failed (schema mismatch, invalid response)
 */
export class OdooValidationError extends OdooError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_FAILED", context);
    this.name = "OdooValidationError";
  }
}

/**
 * Record not found (lead, contact, product)
 */
export class OdooNotFoundError extends OdooError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "NOT_FOUND", context);
    this.name = "OdooNotFoundError";
  }
}

/**
 * Permission denied (insufficient access)
 */
export class OdooPermissionError extends OdooError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "PERMISSION_DENIED", context);
    this.name = "OdooPermissionError";
  }
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[]; // Error codes that should trigger retry
}

/**
 * Default retry configuration for transient failures
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
  retryableErrors: ["CONNECTION_FAILED", "TIMEOUT", "RATE_LIMIT"],
};

/**
 * Exponential backoff delay calculator
 */
export function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      const isRetryable =
        error instanceof OdooError &&
        config.retryableErrors.includes(error.code);

      if (!isRetryable || attempt === config.maxRetries) {
        console.error(
          `[Odoo] ${operationName} failed after ${attempt + 1} attempt(s):`,
          lastError.message
        );
        throw lastError;
      }

      // Calculate backoff and retry
      const delayMs = calculateBackoffDelay(attempt, config);
      console.warn(
        `[Odoo] ${operationName} attempt ${attempt + 1} failed, retrying in ${delayMs}ms:`,
        lastError.message
      );
      await sleep(delayMs);
    }
  }

  throw lastError || new Error(`${operationName} failed after ${config.maxRetries} retries`);
}

/**
 * Error classification for monitoring/alerting
 */
export function classifyOdooError(error: unknown): {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  requiresAlert: boolean;
  suggestedAction: string;
} {
  if (error instanceof OdooAuthError) {
    return {
      type: "AUTH_FAILED",
      severity: "critical",
      requiresAlert: true,
      suggestedAction: "Verify Odoo credentials and API key in Settings → Secrets",
    };
  }

  if (error instanceof OdooConnectionError) {
    return {
      type: "CONNECTION_FAILED",
      severity: "high",
      requiresAlert: true,
      suggestedAction: "Check Odoo server status and network connectivity",
    };
  }

  if (error instanceof OdooValidationError) {
    return {
      type: "VALIDATION_FAILED",
      severity: "medium",
      requiresAlert: true,
      suggestedAction: "Check Odoo schema changes and update integration",
    };
  }

  if (error instanceof OdooNotFoundError) {
    return {
      type: "NOT_FOUND",
      severity: "low",
      requiresAlert: false,
      suggestedAction: "Verify record ID or search criteria",
    };
  }

  if (error instanceof OdooPermissionError) {
    return {
      type: "PERMISSION_DENIED",
      severity: "high",
      requiresAlert: true,
      suggestedAction: "Check user permissions in Odoo",
    };
  }

  return {
    type: "UNKNOWN",
    severity: "medium",
    requiresAlert: true,
    suggestedAction: "Check logs for details",
  };
}

/**
 * Format error for logging
 */
export function formatOdooError(error: unknown): string {
  if (error instanceof OdooError) {
    return `[${error.code}] ${error.message}${
      error.context ? ` | Context: ${JSON.stringify(error.context)}` : ""
    }`;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}
