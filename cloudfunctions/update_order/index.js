const cloud = require('wx-server-sdk')


cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('order_list').where({
      _id: event.id,
    })
    .update({
      data: {
        status : event.status,
        orderTime : new Date()
      },
    })
  } catch(e) {
    console.error(e)
  }
}