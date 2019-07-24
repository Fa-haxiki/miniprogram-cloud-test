//index.js
const app = getApp()

Page({
  data: {
    goodsList: [],
    pageIndex: 1
  },

  onLoad: function() {
    this.getListData()
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.getListData()
    }
  },

  getListData() {
    // const db = wx.cloud.database();
    let that = this
    // db.collection('goods').get().then(res => {
    //   that.setData({
    //     goodsList: res.data
    //   })
    // })
    console.log(that.data.pageIndex);
    wx.cloud.callFunction({
      name: 'paginator',
      data: {
        dbName: 'goods',
        pageIndex: that.data.pageIndex,
        pageSize: 10
      }
    }).then(res => {
      console.log(res);
      // var pageIndex = that.data.pageIndex;
      that.data.pageIndex++;
      that.setData({
        goodsList: that.data.goodsList.concat(res.result.data),
        hasMore: res.result.hasMore
      })
    }).catch(err => {
      console.log(err);
    })
  }
})
