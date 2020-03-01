import request from '@/utils/request'

export function fetchCurrentBasic(params) {
  return request({
    url: '/api/v1/setting/basic',
    method: 'get',
    params: params
  })
}

export function saveCurrentBasic(data) {
  return request({
    url: '/api/v1/setting/basic',
    method: 'post',
    data
  })
}

export function fetchDiscountsList(params) {
  return request({
    url: '/api/v1/commission/discounts',
    method: 'get',
    params: params
  })
}

export function saveDiscount(data) {
  return request({
    url: '/api/v1/commission/discounts',
    method: 'post',
    data
  })
}

export function updateDiscount(id, data) {
  return request({
    url: '/api/v1/commission/discounts/' + id,
    method: 'put',
    data
  })
}
export function deleteDiscount(id) {
  return request({
    url: '/api/v1/commission/discounts/' + id,
    method: 'delete'
  })
}
