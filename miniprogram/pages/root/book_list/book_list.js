// miniprogram/pages/root/book_list/book_list.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfoList : [],
    num : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.cloud.callFunction({
      name : 'get_all_scan_book',
      success : function(res) {
        // console.log(res);
        that.setData({
          bookInfoList : res.result.data,
          num : res.result.data.length
        })
      }
    })
  },
  check : function(e) {
    let fileUrl = e.target.dataset.url
    wx.showLoading({
    })
    console.log(fileUrl)
    wx.cloud.getTempFileURL({
      fileList: fileUrl,
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
        wx.hideLoading({
          success: (res) => {}
        })
        wx.previewImage({
          urls: list,
          current: list[0]
        })
      },
      fail: console.error
    })
   
   
    
  },
  edit : function(e) {
    let index = e.target.dataset.index
    let _list = this.data.bookInfoList
    wx.cloud.getTempFileURL({
      fileList: _list[index].fileIDList,
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
          url: '../edit_scan_book/edit_scan_book',
          success : function(res){
            res.eventChannel.emit('acceptDataFromOpenerPage',
             {
               bookInfo : _list[index],
               list : list,
               index : index
             })
         }
        })
     
      },
      fail: console.error
    })
   
   
  },
  delete : function(e) {
    let that = this
    let _list = this.data.bookInfoList
    wx.showModal({
      title: '提示',
      content: '请三思而后行',
      success : function(res) {
        if (res.confirm) {
        wx.cloud.callFunction({
          name : 'delete_scan_book',
          data : {
            id : _list[e.target.dataset.index]._id
          }
        }).then(res=>{
          console.log('删除成功')
        })
        _list.splice(e.target.dataset.index, 1)
        that.setData({
          bookInfoList : _list,
          num : _list.length
        })
        }
        
      }
      
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
    const that = this

    wx.cloud.callFunction({
      name : 'get_all_scan_book',
      success : function(res) {
        // console.log(res);
        that.setData({
          bookInfoList : res.result.data,
          num : res.result.data.length
        })
        wx.stopPullDownRefresh()


      }
    })
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