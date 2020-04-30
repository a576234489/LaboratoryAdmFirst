import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/notice/listAll",
    method:'get',
  })
}
export function fetchCreate(data) {
  return request({
    url:"/notice/create",
    method:'post',
    data:data
  })
}
export function fetchUpdate(data) {
  return request({
    url:"/notice/update",
    method:'post',
    data:data
  })
}
export function fetchDelete(id) {
  return request({
    url:"/notice/delete/"+id,
    method:'get',
  })
}



