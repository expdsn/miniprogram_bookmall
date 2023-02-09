// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      typelist:[
        '教材教辅',
        '大学课本',
        '文学小说',
        '职业技能',
        '其他',

      ],
      currentindex:0
  },
  toClassifyList:function(e){
    wx.navigateTo({
      url: '../classify_list/classify_list',
      success : function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage',
         {
            classify : e.currentTarget.dataset.classify
         })
     }
    })
  },
  change(e){
    this.setData({
      currentindex:e.currentTarget.dataset.index
    })
    console.log(this.data.currentindex,e.currentTarget.dataset.index)
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