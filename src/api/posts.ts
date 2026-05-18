import request from './request'

export interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export interface PostListItem {
  id: number
  title: string
  summary: string
  category: string
  coverKey: string
  date: string
  views: number
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export interface PostPageParams {
  current: number
  pageSize: number
}

export function getPublishedPosts(params: PostPageParams) {
  return request.get<ApiResult<PageResult<PostListItem>>>('/posts', { params })
}
