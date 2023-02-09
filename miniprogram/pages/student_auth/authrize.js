// miniprogram/pages/student_auth/authrize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUpload: false,
    fileId: '',
    userInfo: {

    },
    authorizeStatus: 0,
    submiting: false
  },
  doUpload: function() {
    // 选择图片
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath =   './authrize/' + app.globalData.userInfo._openid + filePath.match(/\.[^.]+?$/)[0]
        // console.log(cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              isUpload: true,
              fileID: res.fileID
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            that.wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
  
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
},
  formSubmit: function(e) {
    if (!e.detail.value.userName) {
      wx.showToast({
        title: '姓名不能为空',
        duration:  2000,
        icon: "none"
        })
        return
    } 
    if (!e.detail.value.userId) {
      wx.showToast({
        title: '学号不能为空',
        duration:  2000,
        icon: "none"
        })
        return
    } 
    if (!this.data.isUpload) {
      wx.showToast({
        title: '请先上传头像',
        duration:  2000,
        icon: "none"
        })
        return
    }
    this.setData({
      submiting: true
    })
    const db = wx.cloud.database()
    let that = this
    db.collection('authrize_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        applicant: e.detail.value.userName,
        studentId: e.detail.value.userId,
        fileID: that.data.fileID,
        isAuthorized : false
      },
      success: function(res) {
        app.globalData.userInfo.authorizeStatus = 1
        wx.cloud.callFunction({
          name: 'update_user_info',
          data: {
            openid: app.globalData.userInfo._openid,
            userInfo: app.globalData.userInfo
          }
        }).then(res=>{
          console.log(app.globalData.userInfo)
          wx.showToast({
            title: '上传成功',
            duration: 1500
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
            wx.navigateTo({
              url: '../student_auth/authrize',
            })
          },1500)
        })
       
        
      }
    })

  },
  reAuthorize: function(){
    app.globalData.userInfo.authorizeStatus = 0

      wx.navigateBack({
        delta: 1,
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../student_auth/authrize',
        })
      }, 500)

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
    this.setData({
      authorizeStatus : app.globalData.userInfo.authorizeStatus
    })
    // console.log(app.globalData.userInfo.authorizeStatus)
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