import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/resource/getList",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/resource/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/resource/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/resource/delete/"+id,
    method:'get',
  })
}

export function fetchListAll() {
  return request({
    url:"/resource/listAll",
    method:'get',
  })
}
