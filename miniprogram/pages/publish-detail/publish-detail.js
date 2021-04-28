// pages/publish-detail/publish-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName:'一只特立独行的猪',
    salesReason:'快毕业了，发现有不少闲置书，华工同学直接自提免邮费，我平时都有空。拍前请联系我~',
    bookPhoto:'../../images/publish-detail/pig.png',
    address:'广东  广州',
    money:'0',
    // 原价
    beforeMoney:'￥0',
    // 运费
    transformMoney:'￥0',
  },
fabu:function() {
  wx.navigateTo({
    url: '../publish-success/publish-success'
  })
},
return:function() {
  wx.navigateTo({
    url: '../goods-info/goods-info'
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

  }
})