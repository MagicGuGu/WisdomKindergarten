import request from '@/utils/request'

export function adminLogin(params) {
  return request({
    url: '/adminLogin',
    method: 'post',
    params
  })
}
