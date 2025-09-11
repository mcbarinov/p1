import { HTTPError } from "ky"

export const ErrorGroup = {
  BAD_REQUEST: "bad_request",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  VALIDATION: "validation",
  SERVER_ERROR: "server_error",
  NETWORK_ERROR: "network_error",
  UNKNOWN: "unknown",
} as const

export type ErrorGroup = (typeof ErrorGroup)[keyof typeof ErrorGroup]

export class AppError extends Error {
  readonly group: ErrorGroup

  constructor(group: ErrorGroup, message: string) {
    super(message)
    this.name = "AppError"
    this.group = group
  }
}

function getErrorGroup(statusCode: number): ErrorGroup {
  switch (statusCode) {
    case 400:
      return ErrorGroup.BAD_REQUEST
    case 401:
      return ErrorGroup.UNAUTHORIZED
    case 403:
      return ErrorGroup.FORBIDDEN
    case 404:
      return ErrorGroup.NOT_FOUND
    case 422:
      return ErrorGroup.VALIDATION
    default:
      if (statusCode >= 500) {
        return ErrorGroup.SERVER_ERROR
      }
      return ErrorGroup.UNKNOWN
  }
}

export async function parseHttpError(error: HTTPError): Promise<AppError> {
  const group = getErrorGroup(error.response.status)
  let message = `HTTP ${String(error.response.status)} ${error.response.statusText}`

  try {
    const contentType = error.response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      const data = (await error.response.clone().json()) as Record<string, unknown>
      if (typeof data.error === "string") {
        message = data.error
      }
    }
  } catch {
    // Use default message
  }

  return new AppError(group, message)
}

export async function parseError(error: unknown): Promise<AppError> {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof HTTPError) {
    return parseHttpError(error)
  }

  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new AppError(ErrorGroup.NETWORK_ERROR, "Network connection failed")
  }

  if (error instanceof Error) {
    return new AppError(ErrorGroup.UNKNOWN, error.message)
  }

  return new AppError(ErrorGroup.UNKNOWN, "An unexpected error occurred")
}

export function getErrorTitle(group: ErrorGroup): string {
  switch (group) {
    case ErrorGroup.BAD_REQUEST:
      return "Invalid Request"
    case ErrorGroup.UNAUTHORIZED:
      return "Authentication Required"
    case ErrorGroup.FORBIDDEN:
      return "Access Denied"
    case ErrorGroup.NOT_FOUND:
      return "Not Found"
    case ErrorGroup.VALIDATION:
      return "Validation Error"
    case ErrorGroup.SERVER_ERROR:
      return "Server Error"
    case ErrorGroup.NETWORK_ERROR:
      return "Network Error"
    default:
      return "Error"
  }
}
