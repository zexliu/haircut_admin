import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/shops',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/api/v1/shops/',
    method: 'post',
    data
  })
}
export function update(id, data) {
  return request({
    url: '/api/v1/shops/' + id,
    method: 'put',
    data
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/shops/' + id,
    method: 'get'
  })
}

export function fetchApplys(params) {
  return request({
    url: '/api/v1/shop/apply',
    method: 'get',
    params: params
  })
}
