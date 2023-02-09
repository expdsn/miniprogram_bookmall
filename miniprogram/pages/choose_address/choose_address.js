// pages/shdz/shdz.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },
  choose : function(e) {
    let pages = getCurrentPages()
    var prePage = pages[pages.length - 2]
    
    prePage.setData({
      addressIndex : e.currentTarget.dataset.selected
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 编辑按钮
  edit:function(e) {
    let _address = this.data.userInfo.address[e.target.dataset.index]
    wx.navigateTo({
      url: '../edit_address/edit_address?start_index=' + e.target.dataset.index,
      success : function(res){
         res.eventChannel.emit('acceptDataFromOpenerPage', _address)
      }
    })
  },
  // 添加按钮
  add:function() {
    if (this.data.userInfo.address.length >= 5) {
       wx.showToast({
        title: '地址数已达上限',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo : app.globalData.userInfo
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