// pages/shopping-cart/shopping-cart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList : []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  setInterval(()=>{
  //   app.getMsgList()

  //  }, 10000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  readed : function(e){
    let index = e.currentTarget.dataset.index
    const that = this
    let list = that.data.msgList
    list[index].read = true
    that.setData({
      msgList : list
    })
    wx.cloud.callFunction({
      name : 'delete_alert',
      data : {
        id : list[index]._id
      }
    }).then(res=>{
      app.getMsgList()

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    const that = this
    app.getMsgList().then(value=>{
      that.setData({
        msgList : value
      })

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
    const that = this
    app.getMsgList().then(value=>{
      that.setData({
        msgList : value
      })
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
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