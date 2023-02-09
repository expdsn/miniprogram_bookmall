// pages/publish/publish.js
wx.cloud.init()
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  shuru:function() {
    wx.navigateTo({
      url: '../goods-info/goods-info'
    })
  },
  scanBook : function() {
    const that = this
    let bookInfo = {}
    wx.showLoading({
      title: '正在读取...',
    })
    wx.scanCode({
      scanType : 'barCode',
      success : function(res) {
        
        let code = res.result
        wx.cloud.callFunction({
          name : 'get_scan_book',
          data : {
            ISBN : res.result
          },
        }).then(res=>{
          //本地数据库获取到书籍信息
          if (res.result.data.length > 0) {
            bookInfo = res.result.data[0]
            wx.cloud.getTempFileURL({
              fileList: bookInfo.fileIDList,
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
                }wx.hideLoading({
                  success: (res) => {}
                })
                wx.navigateTo({
                  url: '../goods-info/goods-info' ,
                  success : function(res){
                     res.eventChannel.emit('acceptDataFromOpenerPage', {bookInfo:bookInfo,
                       list:list})
                  }
                })
              },
              fail: console.error
            })
           
          }else {//当本地数据库未获取书籍信息时，使用api获取并添加到本地数据库
            // console.log(code)
            wx.request({
              url: 'https://jisuisbn.market.alicloudapi.com/isbn/query?isbn='+code,
              header: {
                'Authorization' : 'APPCODE '+'fc76bdcc90464549b291b4dae5312a78',
                'Content-Type' : 'application/json; charset=UTF-8'
              },
              success : function(res){
                if (res.data.result == '' || res.data.result.author==null) {
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
                console.log(res)
                let bookInfo = {
                  ISBN : code,
                  author : res.data.result.author,
                  bookName : res.data.result.title,
                  classify : [0, 0],
                  press : res.data.result.publisher
                }
                let list = []
                let _fileIDList = []
                let fileUrl = res.data.result.pic
                fileUrl = fileUrl.slice(0, 4) + 's' + fileUrl.slice(4);
                list.push(fileUrl)
                console.log(fileUrl)
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
                          fileIDList : []
                        }
                        wx.navigateTo({
                          url: '../goods-info/goods-info' ,
                          success : function(res){
                            wx.hideLoading({
                              success: (res) => {}
                            })
                             res.eventChannel.emit('acceptDataFromOpenerPage', {bookInfo:app.globalData.bookInfo,
                               list:[]})
                          }
                        })
                        wx.cloud.callFunction({
                          name : 'add_scan_book',
                          data :{
                            bookInfo : app.globalData.bookInfo
                          },
                          success : function(res) {
                            // console.log('添加成功！' + app.globalData.bookInfo)
                            

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
                    wx.navigateTo({
                      url: '../goods-info/goods-info' ,
                      success : function(res){
                        wx.hideLoading({
                          success: (res) => {}
                        })
                         res.eventChannel.emit('acceptDataFromOpenerPage', {bookInfo:app.globalData.bookInfo,
                           list:[]})
                      }
                    })
                    wx.cloud.callFunction({
                      name : 'add_scan_book',
                      data :{
                        bookInfo : app.globalData.bookInfo
                      },
                      success : function(res) {
                        // console.log('添加成功！' + app.globalData.bookInfo)
                        

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
      fail(res){
        wx.hideLoading({
          success: (res) => {}
        })
        wx.showToast({
          title: '无法识别',
          duration: 2000,
          icon: 'error'
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