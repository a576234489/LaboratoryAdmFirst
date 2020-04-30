import axios from 'axios';
import {getToken} from 'common/auth'
import store from '../store'

// baseURL:'http://192.168.168.45:8081',
// baseURL:'http://120.78.207.225:8234',
export function request(config) {
  const instant = axios.create({
    baseURL:'http://120.78.207.225:8234',
    timeout:50000
  })
  instant.interceptors.request.use(config=>{
    console.log(store.getters.token)
    if(store.getters.token){
      config.headers['Authorization'] = getToken();
    }
    return config;
  },err=>{
    console.log(err)
  })
  instant.interceptors.response.use(res=>{
    return res.data;
  },err=>{
    console.log(err);
  })
  return instant(config)
}

