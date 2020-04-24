import request from '@/utils/request'
export function withdrawal(data) {
  return request({
    url: '/api/v1/agent/transaction/withdrawal',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/api/v1/agent/transaction/current',
    method: 'get',
    params: params
  })
}

