// miniprogram/pages/find/find.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    nav1: 0,
    nav2: 0,
    isreach: false,
    loading : true,
    loaded : false,
    o1 : false,
    o2: false,
    o3:false,
    loadFinal: false,
    freeGoodsList : [
 
    ],
    fressGoodsFileUrlList : [

    ],
    classifyStringList : []
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
  /**
   * 生命周期函数--监听页面加载
   */
  showLoading : function(){


  },
  changeNav2 : function(e){
    this.setData({
      nav2 : e.currentTarget.dataset.index,
      loading: true
    })
    const that = this

    wx.cloud.callFunction({
      name : that.data.nav2==1?'get_rcmd_list':'get_free_goods_list',
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
     
     
      // console.log(that.data.freeGoodsList)
    })
  },
  onLoad: function (options) {
    const that = this
    wx.cloud.callFunction({
      name : 'get_free_goods_list',
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
     
     
      // console.log(that.data.freeGoodsList)
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
    app.getMsgList()
    
    this.setData({
      loadFinal : false
    })
    let that = this
    wx.cloud.callFunction({
      name : "update_user_time",
      data : {
        openid : app.globalData.userInfo._openid
      }
    })
  
  }, 
  reload : function() {
    const that = this
    that.setData({
      page : 0,
      freeGoodsList:[],
      loading : true,
      fressGoodsFileUrlList:[]
    })
    wx.cloud.callFunction({
      name : 'get_free_goods_list',
      data : {
        page : that.data.page
      }
    }).then(res=>{
      if (res.result.data.length == 0) {
        console.log('没有更多数据了')
        wx.showToast({
          title: '没有更多数据了',
          duration: 1000,
          icon: 'none'
        })
        return
      }
      let _freeGoodsList = res.result.data
      that.setData({
        freeGoodsList : _freeGoodsList
      })
      let fileIDList = []
      for (let i = 0; i < _freeGoodsList.length; i++) {
        fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
      }
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
            loading : false
          })
          
        },
        fail: console.error
      })
     
     
    })
  },
  addShow: function() {
    const that = this
    if (that.data.isreach)
      return
    that.setData({
      loaded: true,
      isreach: true
    })
    wx.cloud.callFunction({
      name : 'get_free_goods_list',
      data : {

        page : that.data.page + 1
      }
    }).then(res=>{
      if (res.result.data.length == 0) {
        console.log('似乎没有更多数据了')
        that.setData({
          loaded: false,
          loadFinal: true
        })
        wx.showToast({
          title: '似乎没有更多数据了',
          duration: 1000,
          icon: 'none'
        })
        return
      }
      
      that.setData({
        page : that.data.page + 1
      })
      console.log('分页查询：第' + that.data.page + '页')
      let _freeGoodsList = res.result.data
      that.setData({
        freeGoodsList : that.data.freeGoodsList.concat(_freeGoodsList)
      })
      let fileIDList = []
      let _classifyStringList = []
      for (let i = 0; i < _freeGoodsList.length; i++) {
        fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
        _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
      }
      that.setData({
        classifyStringList : that.data.classifyStringList.concat(_classifyStringList)
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
            fressGoodsFileUrlList : that.data.fressGoodsFileUrlList.concat(list),
            isreach : false,
            loaded:false
          })
          
          
        },
        fail: console.error
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
    const that = this
    that.setData({
      page : 0,
      isreach : false,
      loadFinal : false
    })
    wx.cloud.callFunction({
      name : 'get_free_goods_list',
      data : {
        page : 0
      }
    }).then(res=>{
      let _freeGoodsList = res.result.data
      
      let fileIDList = []
      let _classifyStringList = []
      for (let i = 0; i < _freeGoodsList.length; i++) {
        fileIDList.push(_freeGoodsList[i].bookInfo.fileIDList[0])
        _classifyStringList.push(app.getClassify(_freeGoodsList[i].bookInfo.classify))
      }
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
          
          wx.stopPullDownRefresh({
            success: (res) => {
              console.log(_freeGoodsList)
              that.setData({
             
                freeGoodsList : _freeGoodsList,
                
                fressGoodsFileUrlList : list,
                loaded: false,
                classifyStringList : _classifyStringList
              })
            },
          })
          
        },
        fail: console.error
      })
     
     
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nav2 == 1)
      return
     this.addShow()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})