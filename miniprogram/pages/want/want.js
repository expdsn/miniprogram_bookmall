// pages/buy/buy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tradelist: [],
    classifyStringList: [],
    fressGoodsFileUrlList: [],
    loading: true,
    userOrderList: []

  },
  change(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentindex: e.currentTarget.dataset.index
    })
  },
  toDetail: function (e) {
    // console.log(e);
    wx.navigateTo({
      url: '../goods-detail/goods-detail',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          goodsItem: e.currentTarget.dataset.goods,
          imgUrl: e.currentTarget.dataset.img
        })
      }
    })

  },
  remove: function (e) {
    const that = this

    wx.showModal({
      content: '确认要移除吗',
      success: res => {
        if (res.confirm) {

          wx.showLoading({
            title: '移除中...',
          })
          let _id = e.currentTarget.dataset.id
     
          let list = that.data.userOrderList.want
          for (let i = 0; i < list.length; i++) {
            if (list[i] == _id) {
              list.splice(i, 1)
            }
          }
          let allList = that.data.userOrderList
          allList.want = list
          wx.cloud.callFunction({
            name: 'update_user_order',
            data: {
              openid: app.globalData.userInfo._openid,
              order: allList
            }
          }).then(res => {
            wx.hideLoading({
              success: (res) => {
                that.reload()
              }
            })
          })

        }
      }
    })
  },
  reload: function () {
    const that = this
    that.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'get_user_order',
      data: {
        openid: app.globalData.userInfo._openid
      }
    }).then(res => {
      that.setData({
        userOrderList: res.result.data[0]
      })
      let list = res.result.data[0].want
      let tasks = []
      for (let i = 0; i < list.length; i++) {
        const promise = new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'get_good_by_id',
            data: {
              id: list[i]
            }
          }).then(res => {
            if (res.result.data.length >= 0) {
              resolve(res.result.data[0])
            }
          })
        })
        tasks.push(promise)
      }
      Promise.all(tasks).then(value => {
        let _freeGoodsList = value
        let fileIDList = []
        let _classifyStringList = []
        that.setData({
          tradelist: _freeGoodsList
        })
        for (let i = 0; i < _freeGoodsList.length; i++) {
          fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
          _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
        }
        that.setData({
          classifyStringList: _classifyStringList
        })
        // console.log(fileIDList)
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
              fressGoodsFileUrlList: list,
              loading: false,
              loaded: false
            })

          },
          fail: console.error
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.cloud.callFunction({
      name: 'get_user_order',
      data: {
        openid: app.globalData.userInfo._openid
      }
    }).then(res => {
      that.setData({
        userOrderList: res.result.data[0]
      })
      let list = res.result.data[0].want
      let tasks = []
      for (let i = 0; i < list.length; i++) {
        const promise = new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'get_good_by_id',
            data: {
              id: list[i]
            }
          }).then(res => {
            if (res.result.data.length >= 0) {
              resolve(res.result.data[0])
            }
          })
        })
        tasks.push(promise)
      }
      Promise.all(tasks).then(value => {
        let _freeGoodsList = value
        let fileIDList = []
        let _classifyStringList = []
        that.setData({
          tradelist: _freeGoodsList
        })
        for (let i = 0; i < _freeGoodsList.length; i++) {
          fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
          _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
        }
        that.setData({
          classifyStringList: _classifyStringList
        })
        // console.log(fileIDList)
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
              fressGoodsFileUrlList: list,
              loading: false,
              loaded: false
            })

          },
          fail: console.error
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