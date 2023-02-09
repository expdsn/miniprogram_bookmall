// miniprogram/pages/check_appraise/check_appraise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId : "",
    myDesc: "",
    sellerDesc: "",
    time: ""
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
      wx.cloud.callFunction({
        name : 'get_appraise',
        data : {
          orderId : that.data.orderId
        }
      }).then(res=>{
        let time = new Date(res.result.data[0].time)
        let s = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate()+ ' ' + time.getHours() + ':' + time.getMinutes() + 
        ':' + time.getMilliseconds()
        that.setData({
          myDesc : res.result.data[0].desc,
          time : s,
          star :  res.result.data[0].star
        })
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