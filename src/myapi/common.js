import {axiosExtend} from "./apiBase";

export function ajax(url,config,flag=1,method='get',catchErr=false) {
  return axiosExtend({
    method: method,
    url: url,
    params: config,
    catchErr: catchErr
  }, flag)
}
