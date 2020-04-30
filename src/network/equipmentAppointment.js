import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/equipmentAppointment/getList",
    method:'get',
    params:params
  })
}



