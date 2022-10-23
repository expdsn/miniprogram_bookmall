const cloud = require('wx-server-sdk')


cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('book_scan_list').where({
      _id : event.bookInfo._id
    })
    .update({
      data: {
        ISBN : event.bookInfo.ISBN,
        author : event.bookInfo.author,
        bookName : event.bookInfo.bookName,
        classify : event.bookInfo.classify,
        press : event.bookInfo.press,
        fileIDList : event.bookInfo.fileIDList
      }
    })
  } catch(e) {
    console.error(e)
  }
}