import request from '@/utils/request'

// 查询Casusers列表
export function listCasusers(query) {
  return request({
    url: '/api/v1/casusers',
    method: 'get',
    params: query
  })
}

// 查询Casusers详细
export function getCasusers(ID) {
  return request({
    url: '/api/v1/casusers/' + ID,
    method: 'get'
  })
}

// 新增Casusers
export function addCasusers(data) {
  return request({
    url: '/api/v1/casusers',
    method: 'post',
    data: data
  })
}

// 修改Casusers
export function updateCasusers(data) {
  return request({
    url: '/api/v1/casusers/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除Casusers
export function delCasusers(data) {
  return request({
    url: '/api/v1/casusers',
    method: 'delete',
    data: data
  })
}

