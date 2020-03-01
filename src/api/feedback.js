import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/feedback',
    method: 'get',
    params: params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/api/v1/feedback/status/' + id,
    method: 'put',
    params: params
  })
}
