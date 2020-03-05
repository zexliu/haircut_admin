import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/banners',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/api/v1/banners',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/v1/banners/' + id,
    method: 'put',
    data
  })
}

export function updateEnableStatus(id, params) {
  return request({
    url: '/api/v1/banners/enableStatus/' + id,
    method: 'put',
    params: params
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/banners/' + id,
    method: 'delete'
  })
}
export function fetchDetail(id) {
  return request({
    url: '/api/v1/banners/' + id,
    method: 'get'
  })
}
