// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  try {
    return await db.collection('book_scan_list').where({
      _id : event.id
    }).remove()
  } catch(e) {
    console.error(e)
  }
}