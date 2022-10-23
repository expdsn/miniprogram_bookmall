const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('user_order_list').where({
    _openid: event.openid // 填入当前用户 openid
  }).get()
}