import request from '@/utils/request'

export function audit(data) {
  return request({
    url: '/api/v1/audits',
    method: 'post',
    data
  })
}
