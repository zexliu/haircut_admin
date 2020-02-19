import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/shops',
    method: 'get',
    params: params
  })
}
