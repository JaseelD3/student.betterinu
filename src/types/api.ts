export type ApiResponse<T> = {
  data: T
  message?: string
  success: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type ApiError = {
  message: string
  code?: string
  statusCode?: number
}
