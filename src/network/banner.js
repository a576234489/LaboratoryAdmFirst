import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/banner/listAll",
    method:'get',
  })
}
export function fetchCreate(data) {
  return request({
    url:"/banner/create",
    method:'post',
    data:data
  })
}
export function fetchUpdate(data) {
  return request({
    url:"/banner/update",
    method:'post',
    data:data
  })
}
export function fetchDelete(id) {
  return request({
    url:"/banner/delete/"+id,
    method:'get',
  })
}



