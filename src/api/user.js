import request from '@/utils/request'

export function current() {
  return request({
    url: '/api/v1/users/current',
    method: 'get'
  })
}

export function fetchList(params) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/users/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/users/',
    method: 'post',
    data
  })
}
export function update(id, data) {
  return request({
    url: '/api/v1/users/' + id,
    method: 'put',
    data
  })
}

export function password(id, params) {
  return request({
    url: '/api/v1/users/admin/' + id + '/password',
    method: 'put',
    params: params
  })
}

