import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/regions',
    method: 'get',
    params: params
  })
}

export function fetchTree(params) {
  return request({
    url: '/api/v1/regions/tree',
    method: 'get',
    params: params
  })
}

export function fetchByCode(code) {
  return request({
    url: '/api/v1/regions/code/' + code,
    method: 'get'
  })
}

