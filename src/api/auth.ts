import request from './request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  username: string
  nickname: string
  avatar?: string | null
}

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export function login(data: LoginParams) {
  return request.post<ApiResult<LoginResult>>('/auth/login', data)
}
