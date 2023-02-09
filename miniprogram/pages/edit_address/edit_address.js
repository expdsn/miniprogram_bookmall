// pages/edit_address/edit_address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    address: {
    },
    index: 0,
    school_list: [
      '郫都校区',
      '宜宾校区'
    ],    
    isDefault: false,
    hasDefaulted: false,
    submitting: false,
    start_index: 0
  },
  cut:function() {
    this.setData({
      isDefault:!this.data.isDefault
    })
  }
  ,
  formSubmit:function(e) {
    
    let _uname = e.detail.value.uname
    let _phone = e.detail.value.phone
    let _school = this.data.school_list[this.data.index]
    let _detailAddress = e.detail.value.detailAddress
    if (_uname == '') {
      wx.showToast({
        title: '姓名不能为空',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (_phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (_phone.length != 11) {
      wx.showToast({
        title: '手机号格式错误',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (_detailAddress == '') {
      wx.showToast({
        title: '地址不能为空',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    this.setData({
      submitting: true
    })
    let _address = {
      bigAddress : _school,
      detailAddress : _detailAddress,
      isDefault : this.data.isDefault,
      phone : _phone,
      uname : _uname
    }


    let _address_list = app.globalData.userInfo.address
    if (this.data.isDefault) {
      _address_list.forEach((item, index)=>{
        item.isDefault = false
      })
    }
    
    _address_list.splice(this.data.start_index, 1, _address)
    if (this.data.hasDefaulted && !this.data.isDefault && _address_list.length>=2 && this.data.start_index != 0 ) {
      _address_list[0].isDefault = true
    }else if(this.data.start_index == 0 && this.data.hasDefaulted && !this.data.isDefault && _address_list.length>=2) {
      _address_list[1].isDefault = true

    }
    app.globalData.userInfo.address = _address_list
    wx.navigateBack({
      delta: 1
    })

    wx.cloud.callFunction({
      name: 'update_user_info',
      data: {
        openid: app.globalData.userInfo._openid,
        userInfo: app.globalData.userInfo
      }
    })
    .then(res => {
      
    })
    .catch(console.error)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        address : data,
        isDefault : data.isDefault,
        start_index : options.start_index,
        index: options.start_index
      })
    })
    if (this.data.address.bigAddress == '郫都校区') {
      that.setData({
        index : 0
      })
    }
    if (this.data.address.isDefault) {
      that.setData({
        hasDefaulted : true
      })
    }
    // console.log(this.data.address)
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    
    })
    // console.log(this.data.index)

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