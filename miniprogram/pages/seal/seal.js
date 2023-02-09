// pages/buy/buy.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status_list:['全部','待发货','待收货','待评价'],
    currentindex:0,
    tradeUrlList : [],
    loading : true,
    classifyStringList : [],
    qq:'',
    phone:'',
    address: '',
    tradelist:[],
    maskFlag: true
  },
  check_appraise : function(e) {
    wx.navigateTo({
      url: '../check_appraise/check_appraise',
      success: res=>{
        res.eventChannel.emit('acceptDataFromOpenerPage',
        {
           orderId : e.currentTarget.dataset.id
        })
      }
    })
  },
  appraise : function(e) {
    wx.navigateTo({
      url: '../appraise/appraise',
      success: res=>{
        res.eventChannel.emit('acceptDataFromOpenerPage',
        {
           orderId : e.currentTarget.dataset.id
        })
      }
    })
  },
  change(e){
    this.setData({
      currentindex:e.currentTarget.dataset.index
    })
    if (this.data.currentindex == 0) {
      this.reLoad()
      return
    }
    const that = this
    wx.cloud.callFunction({
      name : 'get_seal_list_by_index',
      data : {
        openid : app.globalData.userInfo._openid,
        status : that.data.currentindex -1 
      }
    }).then(res=>{

      let tradeList = res.result.data
      that.setData({
        tradelist : tradeList
      })
      let fileIDList = []
      let classifyStringList = []
      for (let i = 0; i < tradeList.length; i++) {
        fileIDList.push(tradeList[i].goodsItem.bookInfo.fileIDList[0])
        classifyStringList.push(app.getClassify(tradeList[i].goodsItem.bookInfo.classify))
      }
      that.setData({
        classifyStringList : classifyStringList
      })
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
  hiddenMask : function() {
 
    this.setData({
      maskFlag : true
    })
  } ,
  reLoad : function(){
    const that = this

    wx.cloud.callFunction({
      name : 'get_seal_list',
      data : {
        openid : app.globalData.userInfo._openid
      }
      
    }).then(res=>{
      let tradeList = res.result.data
      that.setData({
        tradelist : tradeList
      })
      let fileIDList = []
      let classifyStringList = []
      for (let i = 0; i < tradeList.length; i++) {
        fileIDList.push(tradeList[i].goodsItem.bookInfo.fileIDList[0])
        classifyStringList.push(app.getClassify(tradeList[i].goodsItem.bookInfo.classify))
      }
      that.setData({
        classifyStringList : classifyStringList
      })
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
  comfirmGood : function(e) {
    const that = this
    wx.showModal({
      content:'确认已经交货',
      success:res=>{
        if (res.confirm) {
          wx.showLoading({
          })
          wx.cloud.callFunction({
            name : 'update_order',
            data : {
              id:e.currentTarget.dataset.id,
              status: 2
            }
          }).then(res=>{
            wx.hideLoading({
              success: (res) => {
                that.setData({
                  currentindex: 0
                })
                that.reLoad()},
            })
          })
        }
      }
    })
  },
  showInfo : function(e) {
    let phone = e.currentTarget.dataset.phone
    let name = e.currentTarget.dataset.name
    
    this.setData({
      maskFlag : false,
      address:'',
      phone : phone,
      name : name
    })

  },
  alert : function(e){
    wx.showLoading({
    })
    let _openid = e.currentTarget.dataset.openid

    wx.cloud.callFunction({
      name : 'get_alert',
      data : {
        alerter : _openid,
        openid : app.globalData.userInfo._openid
      }
    }).then(res=>{
      if (res.result.data.length == 0) {
        wx.cloud.callFunction({
          name : 'add_alert',
          data : {
            alerter : _openid,
            openid : app.globalData.userInfo._openid,
            msg : '提醒你收货',
            read: false,
            type: 0,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName

          }
        }).then(res=>{
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '提醒成功',
                duration : 1500,
                icon:'none'
              })
            },
          })
       
        })
      }else {
        wx.hideLoading({
          success: (res) => {        wx.showToast({
            title: '请勿重复提醒',
            duration: 1500,
            icon:'none'
          })}
        })

      }
      
    })

  },
  showPhone : function(e) {
    let addInfo = e.currentTarget.dataset.address
    this.setData({
      maskFlag : false,
      phone : addInfo.phone,
      address : addInfo
    })
  },
  shiped : function(e) {
    let _id = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title : '提示',
      content : '确认已经发货',
      success : res=>{
 
        if (res.confirm) {
          wx.showLoading({
          })
          wx.cloud.callFunction({
            name : 'update_order',
            data : {
              id : _id,
              status : 1
            }
          }).then(res=>{
            wx.hideLoading({
              success: (res) => {
                that.setData({
                  currentindex: 0
                })
                that.reLoad()
              }
            })
          })
        }
      }
    })

  },
  copy : function(){
    const that = this
    wx.setClipboardData({
      data: that.data.phone,
      success : function(res){
        wx.showToast({
          title: '已经复制到剪贴板',
          duration : 1000,
          icon: 'none'
        })
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
    const that = this
    wx.cloud.callFunction({
      name : 'get_seal_list',
      data : {
        openid : app.globalData.userInfo._openid
      }
      
    }).then(res=>{
      let tradeList = res.result.data
      that.setData({
        tradelist : tradeList
      })
      let fileIDList = []
      let classifyStringList = []
      for (let i = 0; i < tradeList.length; i++) {
        fileIDList.push(tradeList[i].goodsItem.bookInfo.fileIDList[0])
        classifyStringList.push(app.getClassify(tradeList[i].goodsItem.bookInfo.classify))
      }
      that.setData({
        classifyStringList : classifyStringList
      })
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