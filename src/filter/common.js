//filter 集合,可单独引入进行局部引用

/**
 * value 是要过滤的值，不需要手动传入
 * @param {value} value 
 */

//转字符串
export function goString(value) {
  if(value){
    return value.toString()
  }else{
    return ""
  }
}
  

//转数字
export function goNumber(value) {
  return parseInt(value)
}

//转大写
export function toUpperCase(value) {
  return value.toUpperCase()
}

//转小写
export function toLowerCase(value) {
  return value.toLowerCase()
}

//加单位
export function addPostfix(value, arg) {
  return value + " " + arg
}
//向上取整
export function MathCeil(value,arg) {
  return Math.ceil(value / arg)
}
export const CommonFilter = {
  goString,
  goNumber,
  toUpperCase,
  MathCeil
}