const app = getApp();
import { apiHost } from '../config/data.js';
// 请求变量名
const request = (url,data,options = {}) => {
  return new Promise((resolve, reject) => {
      let id = getRandom();
      const promise = wx.request({
        url     : `${apiHost}${url}`,//获取域名接口地址
        method  : options.method || 'POST', //配置method方法
        data    : data, 
        header  : { 
          ...{
            'Content-Type'   : 'application/json; charset=UTF-8',
            'token'  : wx.getStorageSync('token') || ''                   
          },
          ...options.header
        } ,
        success(res) {
          if(res.statusCode == 200){
            let result = res.data;
            if(result.code == 1000){
              resolve(result.data);
            }else if(result.code == 2000){
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000
              })
              reject(result);
            }else if(result.code == 401){
              clearToken();
              wx.redirectTo({
                url: '/pages/user/user',
                success(){
                    wx.showToast({
                      title: '您当前登录状态为未登录。',
                      icon: 'none',
                      duration: 3000
                    })
                }
              })
              reject(result);
            }else{
              wx.showToast({
                title:'responceCode:'+result.code,
                icon: 'none',
                duration: 1500
              })
              reject(result)
            }
          }else{
            wx.showToast({
              title: '请求状态码：'+res.statusCode,
              icon: 'none',
              duration: 1500
            })
            reject({statusCode:res.statusCode,data:res.data})
          }
          reqDelDone(id);
        },
        fail(error) {
          // console.log('request:fail',error);
          reqDelDone(id);
          //微信发送请求失败 error:{errMsg:'request:fail'}
          reject({code:4000,msg:error.data || '请求数据失败，请检查网络环境！'})
        }
      })
      reqPush(id,promise);
      
   
  })
}
// 生成随机数
const getRandom = () => {
  let timeCode = new Date().getTime(),
      alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet.substr(0,Math.ceil(Math.random()*26)) + timeCode + alphabet.substr(0,Math.ceil(Math.random()*26));
}
// 删除已完成的请求项
const reqDelDone = id => {
  for(let i = 0; i < app.globalData.reqList.length; i++) {
    if(app.globalData.reqList[i].id == id) {
      app.globalData.reqList.splice(i, 1);
      break;
    }
  }
}
// 保存待请求对象
const reqPush = (id,requset) => {
  app.globalData.reqList.push({id,requset});
}
//  取消所有请求
const cacelRequestList = () => {
  const requestList = app.globalData.reqList;
  requestList && requestList.length && requestList.forEach(el => {
    el.requset.abort();
  })
}
const clearToken = () =>{
  wx.clearStorageSync();
  cacelRequestList();
}

// 带路由信息跳转到login页
// function toLogin(){
//   const pages = getCurrentPages();
//   const currentPage = pages[pages.length - 1];
//   const url = currentPage.route;
//   const options = currentPage.options;
//   let urlWithArgs = `/${url}?`
//   for (let key in options) {
//     const value = options[key]
//     urlWithArgs += `${key}=${value}&`
//   }
//   urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
//   console.log('aaa',urlWithArgs);
//   // 清除token
//   app.globalData.token = '';
//   wx.removeStorageSync({key: 'token'})
//   wx.red({url: `/pages/user/user?redirect_url=${encodeURIComponent(urlWithArgs)}`});
// }
const requestPayment = (payParam)=>{
  return new Promise((resolve,reject) => {
    wx.requestPayment({
      ...payParam,
      success:(res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  request,
  requestPayment,
  getRandom
  // toLogin 
}