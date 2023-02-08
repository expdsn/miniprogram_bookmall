const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('order_list').where({
    ['buyer._openid']: event.openid, // 填入当前用户 openid
    status : event.status
  }).get()
}