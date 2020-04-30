import {request} from "./request";

export function fetchListAll() {
  return request({
    url:'/role/listAll',
    method:'get',
  })
}
export function fetchGetList(params) {
  return request({
    url:"/role/getList",
    method:'get',
    params:params
  })
}
export function fetchCreate(data) {
  return request({
    url:'/role/create',
    method:'post',
    data:data
  })
}
export function fetchGetItem(id) {
  return request({
    url:'/role/'+id,
    method:'get'
  })
}
export function fetchUpdate(data) {
  return request({
    url:'/role/update',
    method:'post',
    data:data
  })
}
export function fetchDeleteBatch(params) {
  return request({
    url:'/role/delete/batch',
    method:'post',
    params:params
  })
}

export function fetchAllocMenu(params) {
  return request({
    url:"/role/allocMenu",
    method:'post',
    params:params
  })
}

export function fetchGetListMenuByRoleId(roleId) {
  return request({
    url:'/role/listMenu/'+roleId,
    method:'get'
  })
}

export function fetchGetListResourceByRoleId(roleId) {
  return request({
    url:'/role/listResource/'+roleId,
    method:'get'
  })
}

export function fetchAllocResource(params) {
  return request({
    url:'/role/allocResource',
    method:'post',
    params:params
  })
}
