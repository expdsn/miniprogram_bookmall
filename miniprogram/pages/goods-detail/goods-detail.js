// miniprogram/pages/goods-detail/goods-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    goodsItem: {},
    loading: false,
    imgUrl : "",
    urlList : [],
    timeString : "",
    wanted: false,
    userOrderList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goBuy : function() {
    const that = this
    if (app.globalData.userInfo.authorizeStatus==3) {

      wx.navigateTo({
        url: '../qrxd/qrxd',
        success : function(res){
          res.eventChannel.emit('acceptDataFromOpenerPage',
           {
              goodsItem : that.data.goodsItem,
              imgUrl : that.data.imgUrl
           })
       }
      })
    }else {
      wx.showModal({
        content : '你还没有进行学生认证，暂时不能进行购买',
        confirmText : '前往绑定',
        success:res=>{
          if (res.confirm) {
            wx.navigateTo({
              url: '../student_auth/authrize'
            })
          }else {
            return
          }
        }
      })
    }

  },
  changeWant : function(){
    const that = this
    let list = that.data.userOrderList.want
    that.setData({
      wanted : !that.data.wanted
    })
    if (!that.data.wanted) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]== that.data.goodsItem._id) {
          list.splice(i, 1)
        }
      }
    }else {
      list.push(that.data.goodsItem._id)
    }
    let allList = that.data.userOrderList
    allList.want = list
    wx.cloud.callFunction({
      name : 'update_user_order',
      data : {
        openid : app.globalData.userInfo._openid,
        order: allList
      }
    })

  },
  onLoad: function (options) {
    
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({
        goodsItem : data.goodsItem,
        imgUrl : data.imgUrl
      })
      app.getLoginTimeString(data.goodsItem.userInfo._openid).then(res=>{
        that.setData({
          timeString : res
        })
      })
      wx.cloud.callFunction({
        name : 'get_user_order',
        data : {
          openid : app.globalData.userInfo._openid
        }
      }).then(res=>{
        that.setData({
          userOrderList : res.result.data[0]
        })
        let list = res.result.data[0].want
        for (let i = 0; i < list.length; i++) {
          if (list[i] == data.goodsItem._id) {
            that.setData({wanted :true})
            break
          }
        }
      })

    wx.cloud.getTempFileURL({
      fileList: that.data.goodsItem.bookInfo.fileIDList,
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
          urlList : list
        })
        // console.log(list)
      },
      fail: console.error
    })
   
    // console.log(that.data.goodsItem)
    })
    
  },
  onShow : function() {
    const that = this
    setTimeout(()=>{
      app.getLoginTimeString(that.data.goodsItem.userInfo._openid).then(res=>{
        that.setData({
          timeString : res
        })
      })
    }, 500)

  },
  checkImg : function(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.urlList
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  }
})