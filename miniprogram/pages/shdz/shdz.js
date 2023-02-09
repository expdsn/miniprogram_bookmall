// pages/shdz/shdz.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
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
  // 删除按钮
  delete:function(e){
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该项吗',
      success: function (sm) {
        if (sm.confirm) {
        
        let _index = e.target.dataset.index
        let _address_list = that.data.userInfo.address
        console.log(_address_list)
        // console.log(_index)
        let new_address_list = _address_list.filter(function(i, index){  
          return index != _index
        })
        if (_address_list[_index].isDefault && new_address_list.length > 0) {
          new_address_list[0].isDefault = true
        }
        console.log(new_address_list)
        that.setData({
          ['userInfo.address'] : new_address_list
        })
        app.globalData.userInfo.address = new_address_list
        wx.cloud.callFunction({
          name: 'update_user_info',
          data: {
            openid: app.globalData.userInfo._openid,
            userInfo: app.globalData.userInfo
          }
        }).then(success=>{
          
        })
        // _address_list.splice(_index, 1)
        // console.log(_address_list)
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