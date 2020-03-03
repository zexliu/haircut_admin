import request from '@/utils/request'

export function fetchNumbers(params) {
  return request({
    url: '/api/v1/statistics/numbers',
    method: 'get',
    params: params
  })
}
