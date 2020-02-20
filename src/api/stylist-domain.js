import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/stylist/domains',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/stylist/domains/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/stylist/domains',
    method: 'post',
    data
  })
}
export function update(id, data) {
  return request({
    url: '/api/v1/stylist/domains/' + id,
    method: 'put',
    data
  })
}
