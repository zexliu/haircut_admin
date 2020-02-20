import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/service/projects',
    method: 'get',
    params: params
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/service/projects/' + id,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/service/projects',
    method: 'post',
    data
  })
}
export function update(id, data) {
  return request({
    url: '/api/v1/service/projects/' + id,
    method: 'put',
    data
  })
}
