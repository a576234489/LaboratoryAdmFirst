import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/resourceCategory/listAll",
    method:'get'
  })
}

export function fetchCreate(data) {
  return request({
    url:"/resourceCategory/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/resourceCategory/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/resourceCategory/delete/"+id,
    method:'get',
  })
}
