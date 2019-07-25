// miniprogram/pages/manage/addGoods/addGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImg: 'https://colorhub.me/imgserv/HIxNBiLUJhFngajQsKaviUKf6S2y58KMJmYh47BSFKg/fill/0/500/ce/0/bG9jYWw6Ly8vYzMv/ZjgvNzNhNWJhMTI3/ZjRkNTE1NzkyODQw/MTNmNWMyYWVhZmFj/YzYxYzNmOC5qcGVn.jpg',
    typeList: [],
    chooseType: 0
  },

  // 选择图片并上传
  uploadImage() {
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'my-image' + Date.parse(new Date()) + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            that.setData({
              defaultImg: res.fileID
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  // 选择商品类别
  bindTypeChange(e) {
    this.setData({
      chooseType: e.detail.value
    })
  },

  // 获取分类
  getTypeList() {
    var that = this
    const db = wx.cloud.database()
    db.collection('menu').get().then(res => {
      console.log(res)
      const arr = [];
      if (res.data.length) {
        res.data.forEach(item => {
          arr.push(item.head);
        })
      }
      that.setData({
        typeList: arr
      })
    })
  },

  input(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value
    })
  },

  addGoods() {
    var that = this
    wx.showLoading({
      title: '正在添加...',
    })
    wx.cloud.callFunction({
      name: 'uploadgoods',
      data: {
        head: that.data.typeList[that.data.chooseType],
        obj: {
          name: that.data.name,
          num: "9999",
          picUrl: that.data.defaultImg,
          price: that.data.price,
          rating: "100",
          sales: "0",
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '添加成功',
      })
      that.setData({
        defaultImg: 'https://colorhub.me/imgserv/HIxNBiLUJhFngajQsKaviUKf6S2y58KMJmYh47BSFKg/fill/0/500/ce/0/bG9jYWw6Ly8vYzMv/ZjgvNzNhNWJhMTI3/ZjRkNTE1NzkyODQw/MTNmNWMyYWVhZmFj/YzYxYzNmOC5qcGVn.jpg',
        name: '',
        price: '',
        chooseType: 0
      })
    })
  },

  onLoad: function(options) {
    this.getTypeList()
  },

  onReady: function() {

  },

  onShow: function() {

  },
})