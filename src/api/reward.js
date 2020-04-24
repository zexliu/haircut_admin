import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/rewards',
    method: 'get',
    params: params
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/rewards/' + id,
    method: 'delete'
  })
}

