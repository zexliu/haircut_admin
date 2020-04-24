import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/withdrawal/apply',
    method: 'get',
    params: params
  })
}
