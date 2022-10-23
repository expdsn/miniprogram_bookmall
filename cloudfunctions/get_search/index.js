const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 50
const _ = db.command
exports.main = async (event, context) => {

  // 承载所有读操作的 promise 的数组
  if (event.keyWords == '') {
    return {data : []
    }
  }
  const tasks = []
  const promise = db.collection('origin_goods_list').limit(MAX_LIMIT).orderBy('sellTime', 'desc').
  where(_.or([
    {
      bookInfo : {
        ISBN : event.keyWords
      }
    },
    {
      bookInfo : {
        bookName : db.RegExp({
          regexp: event.keyWords,
          options: 'i',
        })
      }
    },
    {
      bookInfo : {
        press : db.RegExp({
          regexp: event.keyWords,
          options: 'i',
        })
      }
    },
    {
      bookInfo : {
        author : db.RegExp({
          regexp: event.keyWords,
          options: 'i',
        })
      }
    }, 
    {
      desc : event.keyWords
    },
    {
      desc : db.RegExp({
        regexp: event.keyWords,
        options: 'i',
      })
    }
    
  ])).get()
  tasks.push(promise)

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}