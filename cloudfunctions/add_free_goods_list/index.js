const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('origin_goods_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        bookInfo : event.bookInfo,
        userInfo : event.userInfo,
        originAddress : event.originAddress,
        isPostFree : event.isPostFree,
        canNoPost : event.canNoPost,
        desc : event.desc,
        originPrice : event.originPrice,
        postPrice : event.postPrice,
        goodPrice : event.goodPrice,
        position : event.position,
        sellTime : new Date()
      }
    })
  } catch(e) {
    console.error(e)
  }
}