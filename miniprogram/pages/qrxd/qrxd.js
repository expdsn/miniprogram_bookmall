// pages/qrxd/qrxd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickRange :['配送', '自提'],
    picked: 0,
    goodsPrice : 0,
    postPrice : 0,
    totalPrice: 0,
    number: 1,
    addressIndex : -1,
    userInfo : {},
    //////////////,
    goodsItem :{},
    imgUrl: "",
    classifyString : "",
    timeString: "",
    submitting : false
  },
  pickerChange : function(e) {
    // console.log(e);
    this.setData({
      picked : e.detail.value
    })
    if (this.data.picked == 0) {
      this.setData({
        postPrice : this.data.goodsItem.postPrice
      })
    }
    if (this.data.picked == 1) {
      this.setData({
        postPrice : 0
      })
    }

    this.computePrice()
  },
  locate:function(e) {
    wx.navigateTo({
      url: '../choose_address/choose_address'
    })
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
  computePrice : function() {
    let goodsPrice = this.data.goodsPrice
    let postPrice = this.data.postPrice

    let totalPrice = parseFloat(goodsPrice) + parseFloat(postPrice) 
  
    this.setData({
      totalPrice : totalPrice
    })
  },
  makeOrder : function() {
    wx.showLoading({
      title: '正在确认商品...'
    })
    const that = this
    if (that.data.addressIndex == -1) {
      wx.showToast({
        title: '请选择地址',
        duration : 1001,
        icon : 'none'
      })
      return
    }
 
    new Promise ((resolve, reject)=>{
      wx.cloud.callFunction({
        name : 'add_new_order',
        data : {
          goodsItem : that.data.goodsItem,
          money : that.data.totalPrice,
          buyer : app.globalData.userInfo,
          address : app.globalData.userInfo.address[that.data.addressIndex],
          status : 0,
          postMethod : that.data.picked
        }
      }).then(res=>{
        resolve(res.result)
      })
    }).then(value=>{
      new Promise((resolve, reject)=>{
        wx.cloud.callFunction({
          name : 'get_user_order',
          data : {
            openid : app.globalData.userInfo._openid
          }
        }).then(res=>{ 
            resolve({order : res.result, id : value._id})
            wx.showLoading({
              title: '正在创建订单...'
            })
        })
      }).then(value=>{
        new Promise((resolve, reject)=>{
          let order = value.order.data[0]
          order.buyIn.push(value.id)
          wx.cloud.callFunction({
            name : 'update_user_order',
            data : {
              openid : app.globalData.userInfo._openid,
              order : order
            }
          }).then(res=>{
            // console.log(that.data.goodsItem._id);
            wx.showLoading({
              title: '正在确认订单...'
            })
            wx.cloud.callFunction({
              name : 'delete_good',
              data : {
                id : that.data.goodsItem._id
              }
            }).then(res=>{
              resolve(res)

            })
          })
        }).then(value=>{
          wx.cloud.callFunction({
            name : 'add_alert',
            data : {
              alerter : that.data.goodsItem.userInfo._openid,
              openid : app.globalData.userInfo._openid,
              msg : app.globalData.userInfo.nickName + '购买了你的商品',
              read: false,
              type: 1
            }
          })
          wx.hideLoading({
            success: (res) => {
              wx.reLaunch({
                url: '../find/find',
              })
            },
          })
        })
      })
    })
 
  

    that.setData({
      submitting: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        goodsItem : data.goodsItem,
        imgUrl : data.imgUrl,
        classifyString : app.getClassify(data.goodsItem.bookInfo.classify),
        goodsPrice : data.goodsItem.goodPrice,
        postPrice : data.goodsItem.postPrice
      })
      if (that.data.goodsItem.isPostFree) {
        that.setData({
          postPrice : 0
        })
      }
      that.computePrice()
      app.getLoginTimeString(data.goodsItem.userInfo._openid)
      .then(res=>{
        that.setData({
          timeString : res
        })
      })
    })
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
    const that = this
    that.setData({
      userInfo : app.globalData.userInfo

    })
    let addresses = that.data.userInfo.address
    let index = -1
    if (that.data.addressIndex != -1) {
      return
    }
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].isDefault) {
        index = i
        break
      }
    }
    that.setData({
      addressIndex : index
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

  },
})
