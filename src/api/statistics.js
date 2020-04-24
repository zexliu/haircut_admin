import request from '@/utils/request'

export function fetchNumbers(params) {
  return request({
    url: '/api/v1/statistics/numbers',
    method: 'get',
    params: params
  })
}

export function fetchAgentNumbers(params) {
  return request({
    url: '/api/v1/statistics/numbers/agent',
    method: 'get',
    params: params
  })
}

export function brokenLines(params) {
  return request({
    url: '/api/v1/statistics/brokenLines',
    method: 'get',
    params: params
  })
}

export function brokenLinesAgent(params) {
  return request({
    url: '/api/v1/statistics/brokenLines/agent',
    method: 'get',
    params: params
  })
}

export function pie(params) {
  return request({
    url: '/api/v1/statistics/pie',
    method: 'get',
    params: params
  })
}

export function bar(params) {
  return request({
    url: '/api/v1/statistics/bar',
    method: 'get',
    params: params
  })
}

export function pieAgent(params) {
  return request({
    url: '/api/v1/statistics/pie/agent',
    method: 'get',
    params: params
  })
}

export function barAgent(params) {
  return request({
    url: '/api/v1/statistics/bar/agent',
    method: 'get',
    params: params
  })
}
