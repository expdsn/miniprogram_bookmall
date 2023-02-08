const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('alert_list').where({
    alerter: event.alerter,
    _openid : event.openid,
    read: false
  }).get()
}