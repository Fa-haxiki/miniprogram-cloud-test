// miniprogram/pages/manage/addGoods/addGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
  },

  addGoods() {
    let that = this
    const goods = {
      name: '',
      img: '../../../images/user-unlogin.png',
      price: ''
    }
    let list = that.data.goodsList
    list.push(goods)
    that.setData({
      goodsList: list
    })
  },

  uploadImage(e) {
    let that = this
    let index = e.currentTarget.dataset.index;
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
              ['goodsList[' + index + '].img']: res.fileID
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

  input(e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    switch (type) {
      case 'name':
        that.setData({
          ['goodsList[' + index + '].name']: e.detail.value
        })
        break;
      case 'price':
        that.setData({
          ['goodsList[' + index + '].price']: e.detail.value
        })
        break;
      default:
        break;
    }
  },

  deleteItem(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.goodsList;
    list.splice(index, 1);
    this.setData({
      goodsList: list
    })
  },

  addAllGoods() {
    let that = this
    let list = that.data.goodsList
    if (that.data.goodsList.length) {
      let flag = 1;
      list.forEach(item => {
        if (item.name && item.price) {
          item.notOk = false
        } else {
          item.notOk = true
          flag = 2
        }
      })
      that.setData({
        goodsList: list
      })
      if (flag == 2) {
        return
      }
    } else {
      wx.showToast({
        title: '请至少添加一个商品',
        icon: 'none'
      })
      return
    }
    const db = wx.cloud.database();
    for (let i = 0; i < that.data.goodsList.length; i++) {
      wx.showLoading({
        title: '正在上传' + (i + 1) + '号商品',
      })
      db.collection('goods').add({
        data: {
          name: that.data.goodsList[i].name,
          img: that.data.goodsList[i].img,
          price: that.data.goodsList[i].price
        },
        success(res) {
          console.log(res);
        }
      })
    }
    wx.hideLoading()
    wx.showToast({
      title: '上传完毕',
    })
    that.setData({
      goodsList: []
    })
  },

  addTest() {
    // const db = wx.cloud.database();
    // const _ = db.command
    // db.collection('menu').where({
    //   head: '饮料'
    // })
    // .update({
    //   data: {
    //     content: _.push({
    //       name: "RIO",
    //       num: "9999",
    //       picUrl: "../../images/2.png",
    //       price: "9.9",
    //       rating: "10",
    //       sales: "0",
    //     })
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    wx.cloud.callFunction({
      name: 'uploadgoods',
      data: {
        head: '饮料',
        obj: {
          name: "RIO",
          num: "9999",
          picUrl: "../../images/2.png",
          price: "9.9",
          rating: "10",
          sales: "0",
        }
      }
    }).then(res => {
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})