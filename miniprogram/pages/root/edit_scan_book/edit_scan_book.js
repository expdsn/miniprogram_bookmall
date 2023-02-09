// pages/goods-info/goods-info.js
wx.cloud.init()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : "",
    bookName:'',
    author:'',
    press: '',
    ISBN:'',
    fileIDList : [],
    multiArray : [[ '教材教辅','大学课本', '文学小说', '职业技能',  '其他'], ['考研用书', '等级考试', '资格考试']],
    multiIndex: [0, 0],
    index : 0,
    fileUrlList : [],
    isClassify : false,
    isUpload: false,
    uploaderList : []
  },
  bindMultiPickerChange : function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      multiIndex: e.detail.value,
      isClassify : true
    })
  },
  initPicker : function() {

    let data = {
      multiArray : this.data.multiArray,
      multiIndex : this.data.multiIndex
    }
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

    this.setData({
      multiArray : data.multiArray,
      multiIndex : data.multiIndex
    })
    // console.log(data.multiIndex)
    // console.log(data.multiArray);
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
          data.multiArray[1] = ['公共必修', '公共选修', '计算机类', '网络通信', '经管会计', '机械专业', '其他专业'];
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
  formSubmit : function(e) {
    console.log('submit');
    console.log(e)
    // wx.cloud.callFunction({
    //   name : "update_scan_book"
    // }).then(res=>{
    //   console.log('廖永成');
    // })
    let _bookInfo = {
      _id : this.data.id,
      ISBN : e.detail.value.ISBN,
      author : e.detail.value.author,
      bookName : e.detail.value.bookName,
      press : e.detail.value.press,
      fileIDList : this.data.fileIDList,
      classify : [-1, -1]
    }
    if (this.data.isClassify) {
      _bookInfo.classify = this.data.multiIndex
    }
    console.log(_bookInfo)
    const that = this
    let _fileIDList = []
    let task = []
    let _uploaderList = that.data.uploaderList
    console.log(_bookInfo)
    if (that.data.isUpload) {
      for (let i = 0; i < that.data.fileIDList.length; i++) {
        const promise = new Promise((resolve, reject)=>{wx.cloud.deleteFile({
          fileList : that.data.fileIDList
        }).then(res=>{
          resolve('删除成功')
        }).catch(error=>{
        })})
        task.push(promise)
      }
    }
    
    

    for (let i = 0; i < _uploaderList.length ; i++) {
      const filePath = _uploaderList[i]
  
      const cloudPath =   './book_cover/' + _bookInfo.ISBN + '_' + i + filePath.match(/\.[^.]+?$/)[0]
      const promise = new Promise((resolve, reject)=>{
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            
            _fileIDList.push(res.fileID)
            console.log(_fileIDList)
            resolve('上传成功')
          }
        })
        
      }) 
      task.push(promise)
      
  
    }
    console.log(that.data.isUpload);
    Promise.all(task).then(value=>{
        
    if (!that.data.isUpload) {
      _bookInfo.fileIDList = that.data.fileIDList

    }else {
      _bookInfo.fileIDList = _fileIDList
    }
    let pages = getCurrentPages(); //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    console.log(_bookInfo)
    prevPage.setData({  
      ['bookInfoList['+that.data.index+']']: _bookInfo
    })
    wx.cloud.callFunction({
      name : 'update_scan_book',
      data : {
        bookInfo : _bookInfo
      },
      success : function() {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getUploaderList : function(e) {
    console.log(e);
    this.setData({
      uploaderList : e.detail.uploaderList,
      isUpload: true
      
    })

    
    
  
  },
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()

    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      // console.log(data)
      that.setData({
        bookName : data.bookInfo.bookName,
        author : data.bookInfo.author,
        ISBN : data.bookInfo.ISBN,
        multiIndex : data.bookInfo.classify,
        fileIDList : data.bookInfo.fileIDList,
        press : data.bookInfo.press,
        id : data.bookInfo._id,
        fileUrlList : data.list,
        index : data.index
      })
      if(data.bookInfo.classify[0] == -1) {
        that.setData({
          isClassify : false,
          multiIndex : [0, 0]
        })
      }else {
        that.setData({
          isClassify : true
        })
      }
      that.initPicker()
    })
  }
  
})