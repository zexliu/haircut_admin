import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/comments',
    method: 'get',
    params: params
  })
}
export function fetchOrderList(params) {
  return request({
    url: '/api/v1/comments/order',
    method: 'get',
    params: params
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/comments/' + id,
    method: 'delete'
  })
}
