import request from '@/utils/request'

export function adminLogin(params) {
  return request({
    url: '/adminLogin',
    method: 'post',
    params
  })
}

export function queryDirctionAll(data) {
  return request({
    url: '/queryAll',
    method: 'post',
    data
  })
}

export function getToken(data) {
  return request({
    url: '/getToken',
    method: 'post',
    data
  })
}
