const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('alert_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        alerter : event.alerter,
        _openid : event.openid,
        msg : event.msg,
        pop: event.pop,
        read: event.read,
        time : new Date()
      }
    })
  } catch(e) {
    console.error(e)
  }
}