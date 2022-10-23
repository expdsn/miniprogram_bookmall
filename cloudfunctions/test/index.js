const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let tasks = []
  for (let i = 0; i < event.count;i++) {
    const promise = db.collection('origin_goods_list').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        bookInfo : {
          _id : '17453ede6098ca1d08af622d11335e8e',
          ISBN : '9787309122015',
          fileIDList : ['cloud://cloud1-2gsge2khed30fb59.636c-cloud1-2gsge2khed30fb59-1305570147/book_cover/9787519305468_0.jpg'],
          press: '测试' + i,
          classify: [0,0],
          bookName: '测试数据',
          author: '测试'
        },
        userInfo : event.userInfo,
        originAddress : "测试" + i,
        isPostFree : false,
        canNoPost : true,
        desc : "测试数据" + i,
        originPrice : i + 20,
        postPrice : i,
        goodPrice : 5,
        position : "测试" + i,
        sellTime : new Date()
      }
    })
    tasks.push(promise)
  }
    // 等待所有
  return (await Promise.all(tasks))
}