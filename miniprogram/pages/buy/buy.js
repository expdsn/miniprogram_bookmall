// pages/buy/buy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradelist:[
      {
        bookname:'一只特立独行的猪',
        descript:'快毕业了，发现有不少闲置书，成工同学直接自提免邮费...',
        new:'7成新',
        local:'广东 广州',
        charge:'￥16',
        condition:'交易成功',
        type:0
      },
      {
        bookname:'一只特立独行的猪',
        descript:'快毕业了，发现有不少闲置书，成工同学直接自提免邮费...',
        new:'7成新',
        local:'广东 广州',
        charge:'￥16',
        condition:'交易失败',
        type:0
      }
    ],
    status_list:['全部','待付款','待发货','待收货','待评价','待退款'],
    currentindex:0
  },
  change(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentindex:e.currentTarget.dataset.index
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