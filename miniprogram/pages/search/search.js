// miniprogram/pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading : true,
    holder : '输入书名,作者名,出版社,ISBN...',
    loaded : false,
    loadFinal: false,
    keyWords: "",
    freeGoodsList : [
 
    ],
    fressGoodsFileUrlList : [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  onLoad: function (options) {

  },
  input: function(){
    this.setData({
      holder: ''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  search:function(){
    const that = this
    wx.showLoading({
      title: '搜索中...'
    })
    wx.cloud.callFunction({
      name : 'get_search',
      data : {
        keyWords : that.data.keyWords
      }
    }).then(res=>{
      console.log(res);
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
          wx.hideLoading({
            success: (res) => {},
          })
        },
        fail: console.error
      })
    })
  },
  inputing : function(e) {
    this.setData({
      keyWords: e.detail.value
    })
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