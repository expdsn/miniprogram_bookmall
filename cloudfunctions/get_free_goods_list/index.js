const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 4
exports.main = async (event, context) => {
  const page = event.page 

  // 承载所有读操作的 promise 的数组
  const tasks = []
  const promise = db.collection('origin_goods_list').skip(page * MAX_LIMIT).limit(MAX_LIMIT).orderBy('sellTime', 'desc').get()
  tasks.push(promise)

  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}