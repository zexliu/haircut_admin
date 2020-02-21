import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/v1/shop/coupons/current',
    method: 'get',
    params: params
  })
}

export function create(data) {
  return request({
    url: '/api/v1/shop/coupons',
    method: 'post',
    data
  })
}

export function updatePublishStatus(id, params) {
  return request({
    url: '/api/v1/shop/coupons/' + id + '/publishStatus',
    method: 'put',
    params: params
  })
}

export function pushCoupon(id, params) {
  return request({
    url: '/api/v1/user/coupons/shop/current/' + id,
    method: 'post',
    params: params
  })
}

