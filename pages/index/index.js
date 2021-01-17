//index.js
//获取应用实例
import {
  request
} from '../../config/request.js';
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  gotoTest:function(){
    wx.navigateTo({
      url: '../ui/ui'
    })

    // this.ajax_store_detail({jj:12})
  },
  ajax_store_detail(params) {
    request('/v1/site/login', params, {
      method: 'GET'
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log('error', err)
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
//登录模块
  tapLogin: function() {
    wx.login({

      success: function(res) {
        if (res.code) {

          wx.request({

            url: 'http://127.0.0.1/mancando/garage/app/web/v1/site/login',

            data: {

              username: 'zhangsan', // 用户输入的账号

              password: 'pwd123456', // 用户输入的密码

              code: res.code

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method:'POST',

            success: function(res) {

              // 登录成功
              console.log('服务器啊')
              console.log(res)
              if (res.statusCode === 200) {

               console.log(res.data.data.dd)// 服务器回包内容

              }

            }

          })

        } else {

          console.log('获取用户登录态失败！' + res.errMsg)

        }

      }

    });

  },
  //获取电话号码
  getPhoneNumber:function(e){
    console.log(e)
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    var codeObj = "";
    var that = this;
    //------执行Login---------
    wx.login({
      success: res => {
        console.log('code转换', res.code);

　　　　　　//用code传给服务器调换session_key
        wx.request({
          url: 'http://127.0.0.1/mancando/garage/app/web/v1/site/login', //接口地址
          data: {
            appid: "wx3dee703b8a22338e",
            secret: "你的小程序appsecret",
            code: res.code,
            encryptedData: telObj,
            iv: ivObj
          },
          success: function (res) {
            phoneObj = res.data.phoneNumber;
            console.log("手机号=", phoneObj)
            // wx.setStorage({   //存储数据并准备发送给下一页使用
            //   key: "phoneObj",
            //   data: res.data.phoneNumber,
            // })
          }
        })

        //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
        if (e.detail.errMsg == 'getPhoneNumber:user deny') { //用户点击拒绝
          console.log('没有搜全')
          wx.navigateTo({
            url: '../index/index',
          })
        } else { //允许授权执行跳转
          console.log(e)
          console.log('我授权了')
          // wx.navigateTo({
          //   url: '../test/test',
          // })
        }
      }
    });
  },

  //分享给朋友
  onShareAppMessage (options) {
    console.log(options)
    return {
      title : '分享 View 组件' ,
      desc : 'View 组件很通用' ,
      path : 'pages/logs/logs' ,
      imageUrl:'../../images/icon/no-sotre.png',
        
          };
        },
  //分享朋友圈
  onShareTimeline (options) {
    console.log(options)
    return {
      title : '分享 View 组件' ,
      query : 'cc=bb' ,
      path : 'pages/logs/logs' ,
      imageUrl:'../../images/icon/no-sotre.png',
        
          };

        },
        //地图
        goMap(){
          //请求获取当前位置
        //   wx.getLocation({
        //     type: "wgs84",
        //     success (res) {
        //         console.log(res)
        //     }
        // })
          //选择地点后获取经纬度
      //   wx.getLocation({
      //     type: "wgs84",
      //     success(res) {
      //         wx.chooseLocation({
      //             latitude: res.latitude,
      //             longitude: res.longitude,
      //             success: function(data){
      //     console.log(data)
      //       }
      //         })
      //     }
      // })
        //导航
    //   wx.openLocation({
    //     latitude: 30.64242,
    //     longitude: 104.04311,
    //     name: "武侯区人民政府(武侯祠大街南)",
    //     address: "四川省成都市武侯区武侯祠大街264号"
    // })
        
      },
      //扫码
      goScan(){
        wx.scanCode({
          onlyFromCamera:true,
          success:(res)=>{
              console.log(res)
          }
        })
      },
      //拍照/相册
      goPicture(){
        wx.chooseImage({
          success:(res)=>{
            console.log(res)
          }
        })
      },

      uploadPicture(){
        var that = this;//this赋值给thata
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
              console.log('成功啦')
              console.log(res)
                var tempFilePaths = res.tempFilePaths
                console.log(tempFilePaths)
                wx.uploadFile({
                    url: 'http://127.0.0.1/mancando/garage/app/web/v1/site/login',//获取服务器地址。这里和lua后台输入就可以直接运行。
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                      console.log(res)
                    }
                })
            },
            fail:function(err){
              console.log('错了')
              console.log(err)
            }
        })
    },

    goPhone(){
      wx.makePhoneCall({
        phoneNumber: '13695049209',
      })
    }

})
