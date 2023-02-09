// pages/goods-info/goods-info.js
const app = getApp()
let _content = ""
let _content2 = ""
let _content3 = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools : ["郫都校区", "宜宾校区"],
    bookName:'',
    author:'',
    press: '',
    ISBN:'',
    fileIDList : [],
    multiArray : [[ '教材教辅','大学课本', '文学小说', '职业技能',  '其他'], ['考研用书', '等级考试', '资格考试']],
    multiIndex: [-1, -1],
    index : 0,
    fileUrlList : [],
    isClassify : false,
    isUpload: false,
    uploaderList : [],
    keyShow: false,//默认显示键盘
    content: '',//输入内容
    hasPrice: false,
    price: "",
    keyInputing : 0,
    KeyboardKeys: [1, 2, 3 , 4, 5, 6, 7, 8, 9, 0,'·'],
    content:"",
    contentList:[],
    content1:"",
    content2:"",
    content3: "",
    originPrice : "",
    postPrice: "",
    isPostFree : false,
    canNoPost: true,
    submitting : false,
    school : "郫都校区"
    
  },
  schoolChange : function(e) {
    // console.log(e)
    this.setData({
      school : this.data.schools[e.detail.value]
    })
  },
  keyInput : function(e) {
    this.setData({
      keyInputing : e.currentTarget.dataset.keys
    })
  },
  bindMultiPickerChange : function(e) {

    this.setData({
      multiIndex: e.detail.value,
      isClassify : true
    })
  },
  canNoPost: function() {
    this.setData({
      canNoPost : !this.data.canNoPost
    })
    console.log(this.data.canNoPost)
  },
  formSubmit : function(e) {
    const that = this
    let _bookName = e.detail.value.bookName
    let _author = e.detail.value.author
    let _ISBN = e.detail.value.ISBN
    let _desc = e.detail.value.desc
    let _press = e.detail.value.press
    let _fileIDList = []
    let _classify = that.data.multiIndex
    
    let _userInfo = app.globalData.userInfo
    // console.log(_userInfo);
    let _isPostFree = that.data.isPostFree
    let _canNoPost = that.data.canNoPost
    let _uploaderList = that.data.uploaderList
    let task = []
    let _bookInfo = {
      bookName : _bookName,
      author : _author,
      ISBN : _ISBN,
      press : _press,
      classify : _classify,
      fileIDList : _fileIDList

    }
    // console.log(that.data.isClassify);

    if (_desc == '') {
      wx.showToast({
        title: '请添加描述',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (_uploaderList.length == 0) {
      wx.showToast({
        title: '请上传至少一个图片',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (_bookName == '') {
      wx.showToast({
        title: '请输入书名',
        duration : 2000,
        icon : "none"
      })
      return
    }   
     if (_author == '') {
      wx.showToast({
        title: '请输入作者名',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (_press == '') {
      wx.showToast({
        title: '请输入出版社',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (_ISBN == '') {
      wx.showToast({
        title: '请输入ISBN',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (!that.data.isClassify) {
      wx.showToast({
        title: '请先分类',
        duration : 2000,
        icon : "none"
      })
      return
    }
    if (that.data.price == '') {
      wx.showToast({
        title: '请输入价格',
        duration : 2000,
        icon : "none"
      })
      return
    }    
    if (that.data.postPrice == '' && !that.data.isPostFree) {
      wx.showToast({
        title: '请输入邮费',
        duration : 2000,
        icon : "none"
      })
      return
    }   
    let s = that.data.price

    that.setData({
      submitting : true
    })
    wx.showLoading({
      title: '发布中...',
    })
    for (let i = 0; i < _uploaderList.length ; i++) {
      const filePath = _uploaderList[i]
  
      const cloudPath =   './origin_goods_img/' + _ISBN + '_' + _userInfo._openid + '_' + Math.round(Math.random()*10000+1) + filePath.match(/\.[^.]+?$/)[0]
      const promise = new Promise((resolve, reject)=>{
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            
            _fileIDList.push(res.fileID)
            // console.log(_fileIDList)
            resolve('上传成功')
          }
        })
        
      }) 
      task.push(promise)
      
  
    }
    Promise.all(task).then(value=>{

      _bookInfo.fileIDList = _fileIDList.reverse()
      // console.log(_userInfo)
      // console.log(_bookInfo)
      wx.cloud.callFunction({
        name : "add_free_goods_list",
          data : {
          bookInfo : _bookInfo,
          userInfo : _userInfo,
          desc : _desc,
          originPrice : parseFloat( that.data.originPrice),
          goodPrice : parseFloat(that.data.price),
          postPrice : parseFloat(that.data.postPrice),
          isPostFree : _isPostFree,
          canNoPost : _canNoPost,
          position : that.data.school,
          
          status: 0
        }
      }).then(res=>{
        console.log(res);
        let _id = res.result._id
        wx.cloud.callFunction({
          name : 'get_user_order',
          data : {
            openid : app.globalData.userInfo._openid
          }
        }).then(res=>{
          let order = res.result.data[0]
          order.publish.push(_id)
          wx.cloud.callFunction({
            name : 'update_user_order',
            data : {
              openid : app.globalData.userInfo._openid,
              order : order
            }
          }).then(res=>{
            
          })
        })
        wx.hideLoading({
          success: (res) => {
            wx.reLaunch({
              url: '../publish-success/publish-success'
    
            })
          },
        })


      })
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
  hindKeyboard() {
    var _this = this
    _this.setData({
        keyShow: false
    });
},
//点击输入框，键盘显示
showKeyboard() {
    var _this = this
    _this.setData({
        keyShow: true,
        content1 : this.data.price,
        content2 : this.data.originPrice,
        content3 : this.data.postPrice
    });
    
},
keyTap(e) {
  
  var _this = this

  let content = _this.data.content
    if (this.data.keyInputing == 0) {
      return
    }
  if (_this.data.keyInputing == 1) {
    content = this.data.content1
  }else if (this.data.keyInputing == 2) {
    content = this.data.content2
  }else if (this.data.keyInputing == 3) {
    content = this.data.content3
  }
  let keys = e.currentTarget.dataset.keys
  let len = content.length
  switch (keys) {
      case '·': //点击小数点，（注意输入字符串里的是小数点，但是我界面显示的点不是小数点，是居中的点，在中文输入法下按键盘最左边从上往下数的第二个键，也就是数字键1左边的键可以打出居中的点）
          if (len < 11 && content.indexOf('.') == -1) { //如果字符串里有小数点了，则不能继续输入小数点，且控制最多可输入10个字符串
              if (content.length < 1) { //如果小数点是第一个输入，那么在字符串前面补上一个0，让其变成0.
                  content = '0.';
              } else { //如果不是第一个输入小数点，那么直接在字符串里加上小数点
                  content += '.';
              }
          }
          break;
      case 0:
          if (len < 4) {
              if (content.length < 1) { //如果0是第一个输入，让其变成0.
                  content = '0.';
              }else{
                  content += '0'
              }
          }
          break;
      case '<': //如果点击删除键就删除字符串里的最后一个
          content = content.substr(0, content.length - 1);
          break;
      default:
          let Index = content.indexOf('.'); //小数点在字符串中的位置
          if (Index == -1 || len - Index != 3) { //这里控制小数点只保留两位
              if (len < 5) { //控制最多可输入10个字符串
                  content += keys;
              }
          }
          break
  }


  if (_this.data.keyInputing == 1) {
    _this.setData({
      content1 : content
    
    })
    _content = content
  }  if (_this.data.keyInputing == 2) {
    _this.setData({
      content2 : content
    
    })
    _content2 = content
  }  if (_this.data.keyInputing == 3) {
    _this.setData({
      content3 : content
    })
    _content3 = content
  }

},
payTap(){
  this.hindKeyboard()
  if (_content.endsWith('.')) {
    _content = _content.substr(0, _content.length-1)
  }
  if (_content2.endsWith('.')) {
    _content2 = _content.substr(0, _content2.length-1)
  }
  if (_content3.endsWith('.')) {
    _content3 = _content.substr(0, _content3.length-1)
  }

  this.setData({
    price : _content,
    hasPrice : true,
    originPrice : _content2,
    postPrice : _content3
  })
},
isPostFree: function() {
  this.setData({
    isPostFree : !this.data.isPostFree
  })
  console.log(this.data.isPostFree)
},
  /**
   * 生命周期函数--监听页面加载
   */
  getUploaderList : function(e) {
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
        fileIDList : [],
        press : data.bookInfo.press,
        fileUrlList : []
      })
  
      
    })
    if (that.data.multiIndex[0] != -1) {
      that.initPicker()
      that.setData({isClassify: true})
    }else {
      that.setData({
        multiIndex : [0, 0],
        isClassify : false
      })
      
    }
    if (app.globalData.userInfo.phone=='') {
      wx.showModal({
        content:'当前还未绑定手机号，绑定之后才能发布商品',
        confirmText:'前往绑定',
        cancelText:'暂不绑定',
        success:res=>{
          if (res.confirm) {
            wx.navigateTo({
              url: '../grxx/grxx'
            })
          }else {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
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
    this.initPicker()
    _content2 = ""
    _content3 = ""
    _content = ""
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