// pages/mypage/mypage.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{

    },
    loading: true
  },
  tcdl: function() {
    wx.reLaunch({
      url: '../login/login',
    })
  },
  grxx: function() {
    wx.navigateTo({
      url: '../grxx/grxx',
    })
  },
  shdz:function() {
    wx.navigateTo({
      url: '../shdz/shdz',
    })
  },
  gopage(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  about : function(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  onShow: function () {
      app.getMsgList()

    
    wx.cloud.callFunction({
      name : "update_user_time",
      data : {
        openid : app.globalData.userInfo._openid
      }
    })
    db.collection('user_list').where({
      _openid : app.globalData.userInfo._openid
    })
    .get()
    .then(res =>{
      if (res.data.length > 0) {
        // console.log(res.data)
        //将获取的用户信息放到全局对象池中
        app.globalData.userInfo = res.data[0]
        // console.log(app.globalData.userInfo)
        wx.stopPullDownRefresh()
        this.setData({
          userInfo : app.globalData.userInfo,
          loading: false
        })
      }
    })
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
    db.collection('user_list').where({
      _openid : app.globalData.userInfo._openid
    })
    .get()
    .then(res =>{
      if (res.data.length > 0) {
        // console.log(res.data)
        //将获取的用户信息放到全局对象池中
        app.globalData.userInfo = res.data[0]
        // console.log(app.globalData.userInfo)
        wx.stopPullDownRefresh()
        this.setData({
          userInfo : app.globalData.userInfo
        })
      }
    })

    
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