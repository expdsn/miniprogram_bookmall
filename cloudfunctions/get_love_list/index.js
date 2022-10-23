const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 16
exports.main = async (event, context) => {
  const page = event.page 

  // 承载所有读操作的 promise 的数组
  const tasks = []
  const promise = db.collection('origin_goods_list').skip(page * MAX_LIMIT).limit(MAX_LIMIT).orderBy('sellTime', 'desc').where({
    bookInfo:{
      classify : _.eq([2,0]).or(_.eq([1,1])).or(_.eq([2,1])).or(_.eq([2,2])).or(_.eq([2,3]))
    }
  }).get()
  tasks.push(promise)

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}