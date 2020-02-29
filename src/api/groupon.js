import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/user/groupons',
    method: 'get',
    params: params
  })
}
