//app.js
App({
  onLaunch: function () {
    const that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env:'bobo-cloud-o2lib',
        traceUser: true,
      })
    }
 
    this.globalData = {}
  },

  getClassify : function(e) {
    let classifyString = ""
    let classify = e
    switch(classify[0]) {
      case 0 :
        switch (classify[1]) {
          case 0 : classifyString = '考研书籍' 
          break
          case 1 : classifyString = '等级考试'
          break
          case 2 : classifyString = '资格考试'
          break
        }
        break
      case 1 :
        switch (classify[1]) {
          case 0 : classifyString = '公共必修' 
          break
          case 1 : classifyString = '公共选修'
          break
          case 2 : classifyString = '计算机类'
          break
          case 3 : classifyString = '网络通信'
          break
          case 4 : classifyString = '经管专业'
          break
          case 5 : classifyString = '机械专业'
          break
          case 6 : classifyString = '其他专业'
          break
        }
        break
      case 2 : 
      switch (classify[1]) {
        case 0 : classifyString = '经典名著' 
          break
          case 1 : classifyString = '科幻小说'
          break
          case 2 : classifyString = '悬疑小说'
          break
          case 3 : classifyString = '其他'
          break
      }
      break
      case 3 : 
      switch (classify[1]) {
        case 0 : classifyString = '前端开发' 
          break
          case 1 : classifyString = '网络安全'
          break
          case 2 : classifyString = '后端开发'
          break
          case 3 : classifyString = '程序设计'
          break
          case 4 : classifyString = '其他'
          break
      }
      break
      case 4 : 
      classifyString = '其他'
          
      break
      default : 
      classifyString = '其他'

    }

    return classifyString
  },
  getMsgList : async function(e) {
    const that = this
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name : 'get_alert_all',
        data: {
          alerter : that.globalData.userInfo._openid
        }
      }).then(res=>{
        let han = ['星期一', '星期二', '星期三', '星期四', '星期五']
        let list = res.result.data
        for (let i = 0; i < list.length; i++) {
          let userTime = new Date(list[i].time)
          let now = new Date()
          let diffTime = new Date(now.getTime() - userTime.getTime()) / 1000
          var days = parseInt(diffTime/86400); 
          var hours = parseInt(diffTime/3600)-24*days;    
          var minutes = parseInt(diffTime%3600/60); 
          var seconds = parseInt(diffTime%60);  
          if (days === 0) {
            if (now.getHours() - hours > 0) {
              list[i].timeString = userTime.getHours() + ':'+userTime.getMinutes()
            }else {

              list[i].timeString = '昨天 ' + userTime.getHours() + ':'+userTime.getMinutes()
            }
          }else if (days === 1) {
            if ((now.getHours()+24) - hours > 0) {
              list[i].timeString = '昨天 ' + userTime.getHours() + ':'+userTime.getMinutes()
            }else {

              list[i].timeString = han[now.getDay()-1]
            }
          }else {
            list[i].timeString = (userTime.getMonth()+1) + '月' + userTime.getDate() + '日'
          }

        }
        for (let i = 0; i < list.length; i++) {

          if (!list[i].read) {
            wx.showTabBarRedDot({
              index: 3
            })
            break

          }else{
            wx.hideTabBarRedDot({
              index: 3
            })
          }
        }
        resolve(list)
        
      })
    })
  
  },
  getLoginTimeString : async function (e){
    return new Promise((resolve, reject)=>{
      wx.cloud.callFunction({
        name : "get_user",
        data : {
          openid : e
        }
      }).then(res=>{
        if (res.result.data.length > 0) {
          let userTime = new Date(res.result.data[0].lastLoginTime)
          let now = new Date()
          let diffTime = new Date(now.getTime() - userTime.getTime()) / 1000
          var days = parseInt(diffTime/86400); 
          var hours = parseInt(diffTime/3600)-24*days;    
          var minutes = parseInt(diffTime%3600/60); 
          var seconds = parseInt(diffTime%60);  
          // console.log("时间差是: "+days+"天, "+hours+"小时, "+minutes+"分钟, "+seconds+"秒");	
          if (days > 0 ) {
            resolve(days + '天前来过')
          }
          if (hours > 0) {
            resolve(hours + '小时前来过')
          }
          if (minutes > 0) {
            resolve(minutes + '分钟前来过')
          }
          if (seconds > 0) {
            resolve('刚刚来过')
          }
  
        }
      })
    })

  },
  globalData:{}
})
