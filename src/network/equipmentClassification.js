import {request} from './request'

export function fetchListWithChildren(params) {
  return request({
    url:"/equipmentClassification/listWithChildren",
    method:'get'
  })
}

export function fetchGetList(parentId,params) {
  return request({
    url:"/equipmentClassification/getList/"+parentId,
    method:'get',
    params:params
  })
}
export function fetchCreate(data) {
  return request({
    url:"/equipmentClassification/create",
    method:'post',
    data:data
  })
}
export function fetchUpdate(data) {
  return request({
    url:"/equipmentClassification/update",
    method:'post',
    data:data
  })
}
export function fetchDelete(id) {
  return request({
    url:"/equipmentClassification/delete/"+id,
    method:'get',
  })
}


