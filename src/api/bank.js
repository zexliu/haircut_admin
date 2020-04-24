import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/api/v1/agent/bank/current',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/api/v1/agent/bank/current',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/api/v1/agent/bank/current/' + id,
    method: 'put',
    data
  })
}

export function remove(id) {
  return request({
    url: '/api/v1/agent/bank/current/' + id,
    method: 'delete'
  })
}

export function fetchDetail(id) {
  return request({
    url: '/api/v1/agent/bank/' + id,
    method: 'get'
  })
}
