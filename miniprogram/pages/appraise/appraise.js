// miniprogram/pages/appraise/appraise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: -1,
    desc : "",
    submitting: false,
    orderId : "",

  },
  change: function(e) {
    console.log(e);
    this.setData({
      index : e.currentTarget.dataset.index
    })
  },
  submit : function(e) {
    const that = this
    let index = this.data.index
    let desc = this.data.desc
    if (index == -1) {
      wx.showToast({
        title: '请选择评分',
        icon: "none",
        duration : 1500
      })
      return
    }
    if (desc == '') {
      wx.showToast({
        title: '请输入评价',
        icon: 'none',
        duration : 1500
      })
      return
    }
    that.setData({
      submitting: true
    })
    wx.showLoading({
      title: '正在发布...',
    })
    wx.cloud.callFunction({
      name : 'add_appraise',
      data : {
        orderId : that.data.orderId,
        appraiser : app.globalData.userInfo._openid,
        star: that.data.index,
        desc: that.data.desc
      }
    }).then(res=>{
      wx.cloud.callFunction({
        name : 'update_order',
        data: {
          id : that.data.orderId,
          status: 3
        }
      }).then(res=>{
        wx.hideLoading({
        
          success: (res) => {
            wx.navigateBack({
              delta: 1
            })
          },
        })
      })
      
   
    })
  },
  inputing : function(e) {
    this.setData({
      desc: e.detail.value
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        orderId : data.orderId
      })
   
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