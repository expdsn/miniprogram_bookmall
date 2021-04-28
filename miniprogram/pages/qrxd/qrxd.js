// pages/qrxd/qrxd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:'张三',
    phone:'177-6666-9999',
    netname: '老笔斋的老猫',
    bookname: '沉默的大多数',
    booktype:'课外书',
    address: '2舍',
    price: 16,
    number: 1,
    dis_money: 1,
    showMask: false
  },
  locate:function(e) {
    wx.navigateTo({
      url: '../shdz/shdz'
    })
  },
  another:function() {
    var i=this.data.dis_money;
    wx.showActionSheet({
      itemList: ['自提', '配送'],
      success: function (res) {
        if (!res.cancel) {
          i=res.tapIndex;
        }
      }
    })
    wx.setData
    
  },
  maskaccur:function() {
    this.setData({
      showMask: true
    })
  },
  maskhidden:function() {
    this.setData({
      showMask: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
})
