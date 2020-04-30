import {request} from "./request";

export function fetchGetList(params) {
  return request({
    url:"/admin/getList",
    method:'get',
    params:params
  })
}
export function fetchUpdateStatus(id,params) {
  return request({
    url:"/admin/update/status/"+id,
    method: 'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:'/admin/create',
    method:'post',
    data:data
  })
}

export function fetchGetItem(id) {
  return request({
    url:'/admin/'+id,
    method:'get'
  })
}

export function fetchUpdate(data) {
  return request({
    url:'/admin/update',
    method:'post',
    data:data
  })
}

export function fetchDeleteBatch(params) {
  return request({
    url:'/admin/delete/batch',
    method:'post',
    params:params
  })
}

export function fetchUpdateStatusBeach(params) {
  return request({
    url:'admin/update/status/batch',
    method:'get',
    params:params
  })
}

export function fetchUpdatePass(params) {
  return request({
    url:'admin/updatePass',
    method:'post',
    params:params
  })
}
