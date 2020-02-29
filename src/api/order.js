import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/orders',
    method: 'get',
    params: params
  })
}

export function fetchShopList(params) {
  return request({
    url: '/api/v1/shop/orders',
    method: 'get',
    params: params
  })
}
