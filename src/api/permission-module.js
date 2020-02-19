import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/permission/modules',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/permission/modules/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/permission/modules',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/v1/permission/modules/' + id,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/permission/modules/' + id,
    method: 'delete'
  })
}
export function tree() {
  return request({
    url: '/api/v1/permission/modules/tree',
    method: 'get'
  })
}
