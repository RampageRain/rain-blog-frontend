import request from './request'

export function getAdminHello() {
  return request.get('/admin/hello')
}
