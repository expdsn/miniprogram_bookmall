// miniprogram/pages/root/authorize/authorize.js
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_index: 0,
    authList: [],
    fileUrl:"",
    loaded: false,
    loading: true,
    hasInfo: false,
    maxLen: 0,
    submiting: false
  },
  reLoad : function() {
    let that = this
    this.setData({
      loading: true,
      current_index : this.data.current_index + 1,
      fileUrl: ""
    })
    if (that.data.maxLen == that.data.current_index) {
      this.setData({
        hasInfo: false,
        loading: false
      })
      return
    }

    let index = this.data.current_index
    wx.cloud.downloadFile({
      fileID: that.data.authList[index].fileID
    }).then(res=>{
      that.setData({
        fileUrl: res.tempFilePath,
        loading: false,
        hasInfo: true
      })
    })
  },
  pass: function() {
    this.setData({
      submiting: true
    })

    const that = this
    let index = this.data.current_index
    wx.cloud.callFunction({
      name : 'get_user',
      data : {
        openid : that.data.authList[index]._openid
      },
      success : function(res) {
        console.log(res)
        if (res.result.data.length > 0) {
          let userInfo = res.result.data[0]
          userInfo.authorizeStatus = 3
          
          wx.cloud.callFunction({
            name : "update_user_info",
            data : {
              openid : userInfo._openid,
              userInfo : userInfo
            }
          }).then(res => {
           that.reLoad()
            that.setData({
              submiting: false
            })
          })
        }
      }
    })

   
    wx.cloud.callFunction({
      name : "delete_applicant",
      data : {
        openid : (that.data.authList[index])._openid
      }
    }).then(res => {

    })
  },
  refresh: function() {
    const that = this
    //查询用户信息是否存在
    that.setData({
      loading : true
    })
    wx.cloud.callFunction({
      name : 'get_auth_list'
    }).then(res=>{
      console.log(res);
      if (res.result.data.length > 0) {
        that.setData({
          maxLen : res.result.data.length,
          authList: res.result.data,
          current_index : 0
        })
        // console.log(that.data.authList)
        wx.cloud.downloadFile({
          fileID: res.result.data[0].fileID
        }).then(res=>{
          that.setData({
            fileUrl: res.tempFilePath,
            loading: false,
            hasInfo: true
          })
        })
        } else {
          that.setData({
          loading: false,
          hasInfo: false
        })
        }
    }).catch(error=>{
      that.setData({
        loading: false,
        hasInfo: false
      })
    }) 
  },
  refuse: function() {
    const that = this
    that.setData({
      submiting: true
    })
    let index = this.data.current_index
    wx.cloud.callFunction({
      name : 'get_user',
      data : {
        openid : that.data.authList[index]._openid
      },
      success : function(res) {
        if (res.result.data.length > 0) {
          let userInfo = res.result.data[0]
          userInfo.authorizeStatus = 2
          
          wx.cloud.callFunction({
            name : "update_user_info",
            data : {
              openid : userInfo._openid,
              userInfo : userInfo
            }
          }).then(res => {
            // console.log("更新成工")
           that.reLoad()
            that.setData({
              submiting: false
            })
          })
        }
      }
    })


    wx.cloud.callFunction({
      name : "delete_applicant",
      data : {
        openid : (that.data.authList[index])._openid
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
    //查询用户信息是否存在
    wx.cloud.callFunction({
      name : 'get_auth_list'
    }).then(res=>{
      console.log(res);
      if (res.result.data.length > 0) {
        that.setData({
          maxLen : res.result.data.length,
          authList: res.result.data
        })
        // console.log(that.data.authList)
        wx.cloud.downloadFile({
          fileID: res.result.data[0].fileID
        }).then(res=>{
          that.setData({
            fileUrl: res.tempFilePath,
            loading: false,
            hasInfo: true
          })
        })
        } else {
        that.setData({
          loading: false,
          hasInfo: false
        })
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