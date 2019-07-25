// pages/manage/manage.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    password: '',
    name: '',
    goodsList: [],
  },

  infoInput(e) {
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value
    })
  },

  login() {
    var that = this;
    wx.showLoading({
      title: '登录中...',
    })
    const db = wx.cloud.database();
    db.collection('managers').where({
      name: that.data.name,
      password: that.data.password
    }).get().then(res => {
      console.log(res);
      wx.hideLoading();      
      if (res.data.length) {
        wx.setStorageSync('login_status', true);
        wx.setStorageSync('manager', res.data[0].name);
        that.setData({
          isLogin: true
        })
      }
    })
  },

  onLoad: function (options) {
    wx.getStorageSync('login_status') ? this.setData({
      isLogin: true
    }) : this.setData({
      isLogin: false
    })
    const manager = wx.getStorageSync('manager')
    manager ? this.setData({
      name: manager
    }) : ''
  },

  onShow: function () {

  },

  onHide: function () {

  }
})