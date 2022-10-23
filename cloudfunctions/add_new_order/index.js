const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('order_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        buyer : event.buyer,
        goodsItem : event.goodsItem,
        money : event.money,
        status : event.status,
        address : event.address,
        postMethod : event.postMethod,
        orderTime : new Date()
      }
    })
  } catch(e) {
    console.error(e)
  }
}