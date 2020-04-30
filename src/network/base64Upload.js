import {request} from './request'

export function fetchUploadBase64(params) {
  return request({
    url:"/file/upload/base64",
    method:'post',
    data:params
  })
}