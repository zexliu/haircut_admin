import request from '@/utils/request'

export function auth(data) {
  return request({
    url: '/api/v1/oauth/token',
    method: 'post',
    data
  })
}

export function cancleAuth() {
  return request({
    url: '/api/v1/oauth/token',
    method: 'delete'
  })
}
