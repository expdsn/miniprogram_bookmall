// pages/sealing/sealing.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradelist:[
      
    ],
    tradeUrlList : [],
    loading: true
  },
  pushdown : function(e) {
    const that = this
    let _id = e.currentTarget.dataset.id
    let _list = this.data.tradelist
    let _url_list = this.data.tradeUrlList
    wx.showModal({
      title: '提示',
      content: '确认下架该商品',
      success : function(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name : 'delete_good',
            data : {
              id : _id
            }
          }).then(res=>{
          })
          _list.splice(e.currentTarget.dataset.index, 1)
          _url_list.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            tradelist : _list,
            tradeUrlList : _url_list
          })
        }
        
      }
      
    })

  
  },
  flash : function(e) {
    let sellTime = new Date(e.currentTarget.dataset.time)
    let nowTime = new Date()
    let diffTime = new Date(nowTime.getTime() - sellTime.getTime()) / 1000
    var days = parseInt(diffTime/86400); 
    var hours = parseInt(diffTime/3600)-24*days;  

    if (hours <= 24) {
      wx.showToast({
        title: '还没有灰，请明天再来',
        icon : 'none',
        duration : 1500
      })
      return
    }
    wx.showLoading({
      title: '擦亮中...'
    })
    wx.cloud.callFunction({
      name : 'update_free_goods',
      data : {
        id : e.currentTarget.dataset.id
      }
    }).then(res=>{
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '擦亮成功',
            icon : 'success',
            duration : 1500
          })
        },
      })
     
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
    const that = this

    new Promise((resolve, reject)=>{
      wx.cloud.callFunction({
        name : 'get_publish_goods',
        data : {
          openid : app.globalData.userInfo._openid
        },
        success : res=>{
          resolve(res.result)
        }
      })
    }).then(value=>{
      let tradeList = value.data
      that.setData({
        tradelist : tradeList
      })
      let fileIDList = []
      for (let i = 0; i < tradeList.length; i++) {
        fileIDList.push(tradeList[i].bookInfo.fileIDList[0])
      }
      new Promise((resolve, reject)=> {
       wx.cloud.getTempFileURL({
        fileList: fileIDList,
        success: res => {
          // fileList 是一个有如下结构的对象数组
          // [{
          //    fileID: 'cloud://xxx.png', // 文件 ID
          //    tempFileURL: '', // 临时文件网络链接
          //    maxAge: 120 * 60 * 1000, // 有效期
          // }]
          // console.log(res.fileList)
          let list = [];
          for (const item of res.fileList) {
            list.push(item.tempFileURL)
          }
          that.setData({
            tradeUrlList : list,
            loading : false
          })
          
        }
       })
      })

      
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