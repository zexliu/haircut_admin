
import request from '@/utils/request'

export function fetchApplys(params) {
  return request({
    url: '/api/v1/agent/apply',
    method: 'get',
    params: params
  })
}

export function fetchList(params) {
  return request({
    url: '/api/v1/agent',
    method: 'get',
    params: params
  })
}

export function fetchCurrentAgent() {
  return request({
    url: '/api/v1/agent/current',
    method: 'get'
  })
}

export function updateEnableStatus(id, params) {
  return request({
    url: '/api/v1/agent/' + id + '/enableStatus',
    method: 'post',
    params: params
  })
}
