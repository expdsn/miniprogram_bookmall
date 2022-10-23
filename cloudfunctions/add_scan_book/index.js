const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('book_scan_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ISBN : event.bookInfo.ISBN,
        author : event.bookInfo.author,
        bookName : event.bookInfo.bookName,
        classify : event.bookInfo.classify,
        fileIDList : event.bookInfo.fileIDList,
        press : event.bookInfo.press
      }
    })
  } catch(e) {
    console.error(e)
  }
}