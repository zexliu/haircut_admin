import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/permissions',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/permissions/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/permissions',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/v1/permissions/' + id,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/permissions/' + id,
    method: 'delete'
  })
}

export function permissionTree() {
  return request({
    url: '/api/v1/permissions/tree',
    method: 'get'
  })
}
