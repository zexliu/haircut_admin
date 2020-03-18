import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/half/time',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/half/time/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/half/time',
    method: 'post',
    data
  })
}
export function update(id, data) {
  return request({
    url: '/api/v1/half/time/' + id,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/half/time/' + id,
    method: 'delete'
  })
}

