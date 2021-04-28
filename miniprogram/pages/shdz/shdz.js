// pages/shdz/shdz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locallist:[
      {
        // exist: true,
        uname:'张三',
        phone:'177-6666-9999',
        big_address:'郫都校区',
        little_address:'致远居3号楼3226'
      },
      {
        // exist: true,
        uname:'李四',
        phone:'177-4444-9999',
        big_address:'郫都校区',
        little_address:'致远居1号楼3226'
      }
    ]
  },
  // 编辑按钮
  edit:function(e) {
    wx.navigateTo({
      url: '../edit_address/edit_address'
    })
  },
  // 添加按钮
  add:function() {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  // 删除按钮
  delete:function(){
    wx.showModal({
    title: '提示',
    content: '确定删除该项吗',
    success: function (sm) {
    if (sm.confirm) {
    wx.showToast({
    title: '操作成功', // 标题
    icon: 'success', // 图标类型，默认success
    duration: 1500, // 提示窗停留时间，默认1500m
    })
    }
    }
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