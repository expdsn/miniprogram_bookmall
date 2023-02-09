// miniprogram/pages/root/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ISBN : ""
  },
  gopage(e){
    wx.navigateTo({
      url:e.currentTarget.dataset.url,
    })
  },
  generateData: function(){
    wx.showLoading({
      title: '生成中...'
    })
    wx.cloud.callFunction({
      name : 'test',
      data : {
        count: 10,
        userInfo: app.globalData.userInfo
      }
    }).then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  goback(){
    wx.reLaunch({
      url: '../../login/login',
    })
  },
  scanCode : function() {

      wx.showLoading({
        title: '正在读取',
      })

    let that = this
    wx.scanCode({ 
      
      success (res) {
        let code = res.result
        // console.log(res.result)
        
        that.setData({
          ISBN : res.result
        })

        wx.cloud.callFunction({
          name : 'get_scan_book',
          data : {
            ISBN : res.result
          },
        }).then(res=>{
          if (res.result.data.length > 0) {
            wx.showToast({
              title: '该书已存在',
              duration: 2000,
              icon: 'error'
            })
     
            
          }else {
            console.log(code)
            wx.request({
              url: 'https://jisuisbn.market.alicloudapi.com/isbn/query?isbn='+code,
              header: {
                'Authorization' : 'APPCODE '+'fc76bdcc90464549b291b4dae5312a78',
                'Content-Type' : 'application/json; charset=UTF-8'
              },
              success : function(res){
                if (res.data.result == '') {
                 
                  wx.showToast({
                    title: '请手动添加',
                    duration: 2000,
                    icon: 'error'
                  })
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '../scan/scan?code=' + code,
                    })
                  }, 2000)
                  return
                } 
                console.log(res)
                let bookInfo = {
                  ISBN : code,
                  author : res.data.result.author,
                  bookName : res.data.result.title,
                  classify : [-1, -1],
                  press : res.data.result.publisher
                }
                let list = []
                let _fileIDList = []
                let fileUrl = res.data.result.pic
                fileUrl = fileUrl.slice(0, 4) + 's' + fileUrl.slice(4);
                list.push(fileUrl)
                wx.downloadFile({
                  url: list[0],
                  success : function(res) {
                    const filePath = res.tempFilePath
                    const cloudPath =   './book_cover/' + code + '_' + 0 + filePath.match(/\.[^.]+?$/)[0]
                    wx.cloud.uploadFile({
                      cloudPath,
                      filePath,
                      success: res => {
                        
                        // console.log(res)
                        _fileIDList.push(res.fileID)
                     
                        // console.log(_fileIDList)
                        // console.log('上传封面成功')
                        that.setData({
                          fileIDList : _fileIDList
                        })
                        // console.log(_fileIDList)
                        app.globalData.bookInfo = {
                          bookName : bookInfo.bookName,
                          author : bookInfo.author,
                          press : bookInfo.press,
                          ISBN : bookInfo.ISBN,
                          classify : bookInfo.classify,
                          fileIDList : that.data.fileIDList
                        }
                        console.log(app.globalData.bookInfo)
                        
                        wx.cloud.callFunction({
                          name : 'add_scan_book',
                          data :{
                            bookInfo : app.globalData.bookInfo
                          },
                          success : function(res) {
                            // console.log('添加成功！' + app.globalData.bookInfo)
                            console.log(res)
                            app.globalData.bookInfo._id = res.result._id
                            wx.navigateTo({
                              url: '../auto_scan_book/auto_scan_book' ,
                              success : function(res){
                                wx.hideLoading({
                                  success: (res) => {}
                                })
                                 res.eventChannel.emit('acceptDataFromOpenerPage', {bookInfo:app.globalData.bookInfo,
                                   list:list})
                                   
                              }
                            })
                          },
                          fail : function(error) {
                            console.log(error)
                          }
                        })
                       
                      }
                    })
                  },
                  fail : error=>{
                    app.globalData.bookInfo = {
                      bookName : bookInfo.bookName,
                      author : bookInfo.author,
                      press : bookInfo.press,
                      ISBN : bookInfo.ISBN,
                      classify : bookInfo.classify,
                      fileIDList : []
                    }
                    wx.cloud.callFunction({
                      name : 'add_scan_book',
                      data :{
                        bookInfo : app.globalData.bookInfo
                      },
                      success : function(res) {
                        // console.log('添加成功！' + app.globalData.bookInfo)
                        console.log(res)
                        app.globalData.bookInfo._id = res.result._id
                        wx.navigateTo({
                          url: '../auto_scan_book/auto_scan_book' ,
                          success : function(res){
                            wx.hideLoading({
                              success: (res) => {}
                            })
                             res.eventChannel.emit('acceptDataFromOpenerPage',
                              {
                               bookInfo:app.globalData.bookInfo,
                               list:[]
                              })
                               
                          }
                        })
                      },
                      fail : function(error) {
                        console.log(error)
                      }
                    })
                   
                  }
                })
               
                
               
              },
              fail : function(error) {
                wx.hideLoading({
                  success: (res) => {}
                })
                wx.showToast({
                  title: '请手动添加',
                  duration: 2000,
                  icon: 'error'
                })
                return
              }
            })
        
          }
        })
        
      },
      fail : error=> {
        wx.hideLoading({
          success: (e) => {}
        })
        wx.showToast({
          title: '无法识别',
          duration: 2000,
          icon: 'error'
        })
        console.log('无法识别条形码');
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