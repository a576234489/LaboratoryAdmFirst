import {request} from './request'

export function fetchGetList(parentId,params) {
  return request({
    url:"/menu/getList/"+parentId,
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/menu/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/menu/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/menu/delete/"+id,
    method:'get',
  })
}

export function fetchTreeList() {
  return request({
    url:"/menu/treeList",
    method:'get'
  })
}

export function fetchUpdateHidden(params) {
  return request({
    url:'/menu/updateHidden',
    method:'get',
    params:params
  })
}


