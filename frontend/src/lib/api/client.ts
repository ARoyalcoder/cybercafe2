import type { z } from 'zod'
import { env } from '@/lib/env'
import { ApiError, apiProblemSchema, CLIENT_ERROR_CODES } from '@/lib/api/errors'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
}

const REQUEST_ID_HEADER = 'X-Request-Id'

/**
 * The only place the app talks HTTP. Every response is validated against a Zod schema, and every
 * failure - server error body, network failure, unexpected payload - surfaces as an ApiError.
 */
export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, signal } = options

  let response: Response
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json, application/problem+json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }
    throw new ApiError({
      status: 0,
      code: CLIENT_ERROR_CODES.network,
      message: 'Could not reach the server. Check your connection and try again.',
    })
  }

  const requestId = response.headers.get(REQUEST_ID_HEADER) ?? undefined
  const payload: unknown = response.status === 204 ? undefined : await readJson(response)

  if (!response.ok) {
    const problem = apiProblemSchema.safeParse(payload)
    if (problem.success) {
      throw ApiError.fromProblem({ ...problem.data, requestId: problem.data.requestId ?? requestId })
    }
    // e.g. an HTML error page from a proxy in front of the API
    throw new ApiError({
      status: response.status,
      code: CLIENT_ERROR_CODES.unexpectedResponse,
      message: `The server returned an unexpected error (HTTP ${response.status}).`,
      requestId,
    })
  }

  const result = schema.safeParse(payload)
  if (!result.success) {
    console.error(`Response from ${method} ${path} did not match its schema`, result.error.issues)
    throw new ApiError({
      status: response.status,
      code: CLIENT_ERROR_CODES.unexpectedResponse,
      message: 'The server returned data in an unexpected format.',
      requestId,
    })
  }
  return result.data
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}
