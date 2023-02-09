// miniprogram/pages/root/scan/scan.js
const app = getApp()

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ISBN : "",
    multiArray : [[ '教材教辅','大学课本', '文学小说', '职业技能',  '其他'], ['考研用书', '等级考试', '资格考试']],
    multiIndex: [0, 0],
    index : 0,
    uploaderList : [],
    isUpload: false,
    uploading: false


  },
  bindMultiPickerColumnChange : function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let data = {
      multiArray : this.data.multiArray,
      multiIndex : this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: 
      switch (data.multiIndex[0]) {
        case 0:
          data.multiArray[1] = ['考研用书', '等级考试', '资格考试'];
          break;
        case 1:
          data.multiArray[1] = ['公共必修', '公共选修', '计算机类', '网络专业', '经管专业', '机械专业', '其他专业'];
          break;
        case 2:
          data.multiArray[1] = ['经典名著', '科幻小说', '悬疑类', '其他'];
          break;
        case 3:
          data.multiArray[1] = ['前端开发', '网络安全', '后端开发', '程序设计', '其他'];
          break;
        case 4:
          data.multiArray[1] = ['其他'];
          break;
      }
      data.multiIndex[1] = 0;
      break;
    }
    this.setData({
      multiArray : data.multiArray,
      multiIndex : data.multiIndex
    })
    // console.log(data.multiIndex)
    // console.log(data.multiArray);
  },
  getUploaderList : function(e) {
    this.setData({
      uploaderList : e.detail.uploaderList
    })

  },
  formSubmit : function(e){
    const that = this
    const db = wx.cloud.database()
    let _bookName = e.detail.value.bookName
    let _author = e.detail.value.author
    let _press = e.detail.value.press
    let _ISBN = this.data.ISBN
    let _classify = this.data.multiIndex
    let _uploaderList = this.data.uploaderList
    let _fileIDList = []
    const task = []
 
    for (let i = 0; i < _uploaderList.length ; i++) {
      const filePath = _uploaderList[i]
  
      const cloudPath =   './book_cover/' + _ISBN + '_' + i + filePath.match(/\.[^.]+?$/)[0]
      const promise = new Promise((resolve, reject)=>{
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              isUpload: true
            })
            _fileIDList.push(res.fileID)
            console.log(123)
            resolve('上传成功')
          }
        })
        
      }) 
      task.push(promise)
  
    }
    wx.showToast({
      title: '添加成功',
      duration: 1000
    })
    setTimeout(function(){
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
    Promise.all(task).then(value=>{
      // console.log(_fileIDList)

      console.log(1)
      let newBook = {
          bookName : _bookName,
          author : _author,
          press : _press,
          ISBN : _ISBN,
          classify : _classify,
          fileIDList : _fileIDList
      }
      wx.cloud.callFunction({
        name : 'add_scan_book',
        data : {
          bookInfo : newBook
        },
        success : function(res) {
          console.log("添加成功");
        }
      })
    
      
    
    }).catch(reason=>{
      console.log(reason)
    })
    
  
    
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      ISBN : options.code
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