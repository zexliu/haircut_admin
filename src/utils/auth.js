import Cookies from 'js-cookie'

const TokenKey = 'ACCESS-TOKEN'

export function getAccessToken() {
  return Cookies.get(TokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(TokenKey)
}
