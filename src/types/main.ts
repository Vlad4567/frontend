export interface ErrorData<T> {
  timestamp: string,
  status: string,
  error?: T,
  errors?: {
    [key: string]: T
  }
}

export interface Notification {
  id: number,
  title?: string,
  description?: string,
  icon?: string,
}
