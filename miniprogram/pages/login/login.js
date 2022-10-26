// miniprogram/pages/login/login.js
const app = getApp()

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
    isRootLogin: false
  },
  getUserProfile(e) {
    let that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo;
        const db = wx.cloud.database()
        db.collection('user_order_list').add({
          data : {
            publish : [

            ],
            buyIn : [

            ],
            want : [

            ],
            myCart : [

            ]
          }
        })
        db.collection('user_list').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            nickName: that.data.userInfo.nickName,
            avatarUrl : that.data.userInfo.avatarUrl,
            gender : that.data.userInfo.gender,
            sign: '',
            address : [
              
            ],
            authorizeStatus: 0,
            phone: '',
            isRoot: false
          },
          success: function(res) {
  
            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/login/login',
              })
            },1000)
          }
        })
    
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.showLoading({
      title: '登录中...'
    })
    wx.cloud.init()
    //调用云函数登录
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res =>{
      //查询用户信息是否存在
      let openid = res.result.openid
      db.collection('user_list').where({
        _openid : res.result.openid
      })
      .get()
      .then(res => {
        if (res.data.length > 0) {
          // console.log(res.data)
          //将获取的用户信息放到全局对象池中
          app.globalData.userInfo = res.data[0]
          wx.cloud.callFunction({
            name : "update_user_time",
            data : {
              openid : openid
            }
          })
          // console.log(app.globalData.userInfo)
          if (app.globalData.userInfo.isRoot) {
            wx.hideLoading()
            that.setData({
              isRootLogin: true
            })
          }
          else {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
          
        }
        else {
          setTimeout(function () {
            wx.hideLoading()
            that.setData({
              hasUserInfo: false
            })
          }, 500)
          
        }
        
        
        
      })
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  intoProgram: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  intoController: function() {
    
    wx.reLaunch({
      url: '/pages/root/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})