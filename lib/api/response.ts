/**
 * Standard API Response Types and Helpers
 */

import { NextResponse } from 'next/server'

// ============================================================================
// Response Types
// ============================================================================

export interface APISuccess<T = any> {
  success: true
  data?: T
  message?: string
  metadata?: Record<string, any>
}

export interface APIError {
  success: false
  error: string
  details?: string
  code?: string
  statusCode?: number
}

export type APIResponse<T = any> = APISuccess<T> | APIError

// ============================================================================
// Response Builders
// ============================================================================

export function successResponse<T>(
  data?: T,
  message?: string,
  metadata?: Record<string, any>,
  status: number = 200
): NextResponse<APISuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
      ...(metadata && { metadata }),
    },
    { status }
  )
}

export function errorResponse(
  error: string,
  details?: string,
  status: number = 500,
  code?: string
): NextResponse<APIError> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
      ...(code && { code }),
      statusCode: status,
    },
    { status }
  )
}

// ============================================================================
// Common Errors
// ============================================================================

export const CommonErrors = {
  unauthorized: (details?: string) =>
    errorResponse('Unauthorized', details, 401, 'UNAUTHORIZED'),

  forbidden: (details?: string) =>
    errorResponse('Forbidden', details, 403, 'FORBIDDEN'),

  notFound: (resource: string = 'Resource') =>
    errorResponse(`${resource} not found`, undefined, 404, 'NOT_FOUND'),

  badRequest: (details: string) =>
    errorResponse('Bad Request', details, 400, 'BAD_REQUEST'),

  validationError: (details: string) =>
    errorResponse('Validation Error', details, 422, 'VALIDATION_ERROR'),

  internalError: (details?: string) =>
    errorResponse('Internal Server Error', details, 500, 'INTERNAL_ERROR'),

  serviceUnavailable: (service: string) =>
    errorResponse(
      'Service Unavailable',
      `${service} is currently unavailable`,
      503,
      'SERVICE_UNAVAILABLE'
    ),

  rateLimit: (details?: string) =>
    errorResponse('Rate Limit Exceeded', details, 429, 'RATE_LIMIT'),
}

// ============================================================================
// Error Handler
// ============================================================================

export function handleAPIError(error: unknown): NextResponse<APIError> {
  console.error('API Error:', error)

  if (error instanceof Error) {
    // Known error types
    if (error.message.includes('Unauthorized')) {
      return CommonErrors.unauthorized(error.message)
    }
    if (error.message.includes('Not found') || error.message.includes('not found')) {
      return CommonErrors.notFound()
    }
    if (error.message.includes('Forbidden')) {
      return CommonErrors.forbidden(error.message)
    }

    // Generic error with message
    return CommonErrors.internalError(error.message)
  }

  // Unknown error
  return CommonErrors.internalError('An unexpected error occurred')
}

