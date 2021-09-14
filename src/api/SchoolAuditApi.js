import request from '@/utils/request'

export function auditSearch(data) {
  return request({
    url: '/searchAuditInfo',
    method: 'post',
    data
  })
}

export function updateAuditState(data) {
  return request({
    url: '/updateAuditInfo',
    method: 'post',
    data
  })
}
