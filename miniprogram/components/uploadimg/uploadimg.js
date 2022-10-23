// components/uploadimg/uploadimg.js
Component({
  properties: {
    uploaderList: {
      type: Array,
      value: []
    },
    uploaderNum: {
      type: Number,
      value: 0
    },
    desc: {
      type: String,
      // value: '拍照化验单、检查资料报告单、药品处方单、患处照片等。'
    },
    title: {
      type: String,
      value: '补充图片'
    },
    type: {
      // false 开启图文咨询  补充咨询
      type: Boolean,
      value: false
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    uploaderNowNum:0
  },
  lifetimes: {
    ready: function() {
      // console.log("attached")
      // console.log(this.properties.uploaderList)
      this.setData({
        uploaderList : this.properties.uploaderList,
        uploaderNum : this.properties.uploaderNum
      })
      // console.log(this.data.uploaderList)
      // 在组件实例进入页面节点树时执行
    },
    attached: function() {
     
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 删除图片
    clearImg: function(e) {
      var nowList = []; //新数据
 
      var uploaderList = this.data.uploaderList; //原数据
 
      for (let i = 0; i < uploaderList.length; i++) {
        if (i == e.currentTarget.dataset.index) {
          continue;
        } else {
          nowList.push(uploaderList[i])
          continue;
        }
      }
      this.setData({
        uploaderNum: this.data.uploaderNum - 1,
        uploaderList: nowList,
        showUpload: true
      })
      this.triggerEvent('getUploaderList', {
        uploaderList: nowList
      })
    },
    //展示图片
    showImg: function(e) {
      var that = this;
      wx.previewImage({
        urls: that.data.uploaderList,
        current: that.data.uploaderList[e.currentTarget.dataset.index]
      })
    },
    //上传图片
    upload: function(e) {
      var that = this;
      
      wx.chooseImage({
        count: 5 - that.properties.uploaderNum, // 默认5
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // console.log(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          // console.log(tempFilePaths)
 
          let uploaderList = that.data.uploaderList.concat(tempFilePaths);
          uploaderList = uploaderList.reverse()
          if (!that.properties.type) {
            //开启图文咨询
            if (uploaderList.length == 5) {
              that.setData({
                showUpload: false
              })
            }
            that.setData({
              uploaderList: uploaderList,
              uploaderNum: uploaderList.length,
            })
            that.triggerEvent('getUploaderList', {
              uploaderList: uploaderList
            })
          }else{
            // 补充咨询
            if (uploaderList.length + that.properties.uploaderNum === 5) {
              that.setData({
                showUpload: false
              })
            }
            that.setData({
              uploaderList: uploaderList,
              uploaderNowNum: uploaderList.length + that.properties.uploaderNum
            })
            that.triggerEvent('getUploaderList', {
              uploaderList: uploaderList,
              uploaderNowNum: that.data.uploaderNowNum
            })
          }
 
        }
      })
    },
  }
})
