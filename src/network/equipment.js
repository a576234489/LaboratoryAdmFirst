import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/equipment/getList",
    method:'get',
    params:params
  })
}
export function fetchCreate(data) {
  return request({
    url:"/equipment/create",
    method:'post',
    data:data
  })
}
export function fetchUpdate(data) {
  return request({
    url:"/equipment/update",
    method:'post',
    data:data
  })
}
export function fetchUpdateOpenTimeBeach(data) {
  return request({
    url:"/equipment/updateOpenTime/beach",
    method:'post',
    data:data
  })
}
export function fetchDeleteBatch(params) {
  return request({
    url:'/equipment/delete/batch',
    method:'post',
    params:params
  })
}



