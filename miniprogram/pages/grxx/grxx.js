// pages/grxx/grxx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_name:'天河朱丽叶',
    phone:'178-6666-8888',
    num:true,
    userInfo: {},
    inputing: false,
    sign: '这个人很懒，什么都没留下',
    isSigned: false
  },
  cut:function() {
    if(this.data.person_name) {
      this.setData({
        num:!this.data.num
       })
    }
    else {
      num:this.data.num;
      // console.log(1);
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1000//持续的时间
   
      })
    }
    
  },
  inputChange(e) {
    // console.log(e);
    this.setData({
      inputing: true
    })

  },
  signChange() {
    if (!this.data.isSigned) {
      this.setData({
        sign: ''
      })
    }
    this.setData({
      isSigned: true
    })
  },
  formSubmit(e) {
    this.setData({
      inputing: false,
    
    })
    let nickName = e.detail.value.nickName
    let phone = e.detail.value.phone
    let sign = e.detail.value.sign
    if (!this.data.isSigned) {
      sign = ''
    }
    if (nickName == '') {
      wx.showToast({
        title: '昵称不能为空',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (sign.length > 30) {
      wx.showToast({
        title: '字数过长',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        duration: 1000,
        icon: 'error'
      })
      return
    }
    if (phone.length != 11) {
      wx.showToast({
        title: '手机号错误格式',
        duration: 1000,
        icon: 'error'
      })
      return
    }
 
    app.globalData.userInfo.nickName = nickName
    app.globalData.userInfo.phone = phone
    app.globalData.userInfo.sign = sign
    let that = this
    
    console.log(app.globalData.userInfo);
    
    wx.cloud.callFunction({
      name: 'update_user_info',
      data: {
        openid: app.globalData.userInfo._openid,
        userInfo: app.globalData.userInfo
      }
    })
    .then(res => {
      
      wx.navigateBack({
        delta: 1
      })
    })
    .catch(console.error)
  },
  toAuthrize:function() {
    wx.navigateTo({
      url: '../student_auth/authrize',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    
    // console.log(this.data.userInfo.sign != '');
    if(this.data.userInfo.sign!='') {
      this.setData({
        isSigned: true,
        sign:this.data.userInfo.sign
      })
      // console.log(this.data.sign)
    }
    // console.log(this.data.userInfo)
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