const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('order_list').where({
    ['buyer._openid']: event.buyer._openid 
  }).get()
}