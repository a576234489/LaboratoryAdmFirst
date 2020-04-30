import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/user/getList",
    method:'get',
    params:params
  })
}
export function fetchGetListOrdinary(params) {
  return request({
    url:"/user/getListOrdinary",
    method:'get',
    params:params
  })
}
export function fetchCreate(data) {
  return request({
    url:"/user/create",
    method:'post',
    data:data
  })
}
export function fetchUpdate(data) {
  return request({
    url:"/user/update",
    method:'post',
    data:data
  })
}
export function fetchDelete(id) {
  return request({
    url:"/user/delete/"+id,
    method:'get',
  })
}

export function fetchUpdateIsLocked(id,params) {
  return request({
    url:"/user/update/updateIsLocked/"+id,
    method: 'get',
    params:params
  })
}

export function fetchUpdateIsAppointment(id,params) {
  return request({
    url:"/user/update/updateIsAppointment/"+id,
    method: 'get',
    params:params
  })
}

