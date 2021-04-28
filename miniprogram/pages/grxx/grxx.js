// pages/grxx/grxx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    person_name:'天河朱丽叶',
    sign:'认识你们，很开心~',
    phone:'178-6666-8888',
    num:true
  },
  cut:function() {
    if(this.data.person_name) {
      this.setData({
        num:!this.data.num
       })
    }
    else {
      num:this.data.num;
      console.log(1);
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1000//持续的时间
   
      })
    }
    
  },
  inputChange(event) {
    let _this = this;
    let dataset = event.currentTarget.dataset;
    let value = event.detail.value
    let name = dataset.name;
    _this.data[name] = value;
      _this.setData({
        [name]: _this.data[name]
       
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