// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isreach: false,
    loading : true,
    loaded : false,
    loadFinal: false,
    adList:[],
    appidList:[],
    freeGoodsList : [
 
    ],
    fressGoodsFileUrlList : [

    ],
    classifyStringList : [],
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 10000,
    duration: 800,
    loading: true
  },
  toMiniPro : function(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.appidList[index])
    wx.navigateToMiniProgram({
      appId : this.data.appidList[index]
    })
  },
  toSearch : function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  toClassify: function() {
    wx.navigateTo({
      url: '../classify/classify',
    })
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  gopage(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url,
    })
  },
  toDetail : function(e){
    // console.log(e);
    wx.navigateTo({
      url: '../goods-detail/goods-detail',
      success : function(res){
        res.eventChannel.emit('acceptDataFromOpenerPage',
         {
            goodsItem : e.currentTarget.dataset.goods,
            imgUrl : e.currentTarget.dataset.img
         })
     }
    })
 
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.cloud.callFunction({
      name : 'get_love_list',
      data : {
        page : 0
      }
    }).then(res=>{
      let _freeGoodsList = res.result.data
      that.setData({
        freeGoodsList : _freeGoodsList
      })
      let fileIDList = []
      let _classifyStringList = []
      for (let i = 0; i < _freeGoodsList.length; i++) {
        fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
        _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
      }
      that.setData({
        classifyStringList : _classifyStringList
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
            fressGoodsFileUrlList : list,
            loading : false,
            loaded : false
          })
          
        },
        fail: console.error
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
    let that = this

    app.getMsgList()
    wx.cloud.callFunction({
      name : 'get_ad_list'
    }).then(res=>{
      let list = res.result.data
      that.setData({
        adList:list
      })
      let applist = []
      for (let i = 0; i < list.length; i++) {
        applist.push(list[i].appid)
      }
      that.setData({
        appidList : applist
      })
    wx.cloud.callFunction({
      name : 'get_love_list',
      data : {
        page : 0
      }
    }).then(res=>{
      let _freeGoodsList = res.result.data
      that.setData({
        freeGoodsList : _freeGoodsList
      })
      let fileIDList = []
      let _classifyStringList = []
      for (let i = 0; i < _freeGoodsList.length; i++) {
        fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
        _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
      }
      that.setData({
        classifyStringList : _classifyStringList
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
            fressGoodsFileUrlList : list,
            loading : false,
            loaded : false
          })
          
        },
        fail: console.error
      })
    })
    })
    wx.cloud.callFunction({
      name : "update_user_time",
      data : {
        openid : app.globalData.userInfo._openid
      }
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