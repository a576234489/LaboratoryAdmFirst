import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/equipmentMaintain/getList",
    method:'get',
    params:params
  })
}



