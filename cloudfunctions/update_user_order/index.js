const cloud = require('wx-server-sdk')


cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('user_order_list').where({
      _openid: event.openid,
    })
    .update({
      data: {
        buyIn : event.order.buyIn,
        myCart : event.order.myCart,
        publish : event.order.publish,
        want : event.order.want
      },
    })
  } catch(e) {
    console.error(e)
  }
}