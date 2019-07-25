// miniprogram/pages/manage/addSort/addSort.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList: [],
    newSortName: '',
    resetSortName: ''
  },

  getSortList() {
    var that = this
    const db = wx.cloud.database()
    db.collection('menu').get().then(res => {
      console.log(res)
      that.setData({
        sortList: res.data
      })
    })
  },

  randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  },

  input(e) {
    this.setData({
      newSortName: e.detail.value
    })
  },

  newInput(e) {
    this.setData({
      resetSortName: e.detail.value
    })
  },

  addSort() {
    var that = this
    const db = wx.cloud.database()
    db.collection('menu').add({
      data: {
        head: that.data.newSortName,
        content: []
      },
      success(res) {
        console.log(res)
        that.setData({
          newSortName: ''
        })
        that.getSortList();
      }
    })
  },

  deleteSort(e) {
    var that = this
    const sortName = e.currentTarget.dataset.sort
    const db = wx.cloud.database()
    wx.showModal({
      title: '温馨提示',
      content: '删除分类将删除分类下所有商品，继续删除？',
      confirmText: '删除',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
            mask: true
          })
          wx.cloud.callFunction({
            name: 'removeSort',
            data: {
              sortName: sortName
            },
            complete() {
              wx.hideLoading()
              that.getSortList()
            }
          })
        }
      }
    })
  },

  editSort(e) {
    var that = this
    that.setData({
      isEdit: true,
      id: e.currentTarget.dataset.id
    })
  },

  cancelSetSort() {
    this.setData({
      isEdit: false
    })
  },

  confirmSetSort() {
    var that = this
    console.log(that.data.id + '---' + that.data.resetSortName)
    if (that.data.resetSortName) {
      wx.showLoading({
        title: '正在提交...',
        mask: true
      })
      wx.cloud.callFunction({
        name: 'resetSort',
        data: {
          id: that.data.id,
          newName: that.data.resetSortName
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          isEdit: false,
          resetSortName: ''
        })
        that.getSortList()
      })
    } else {
      wx.showToast({
        title: '新的分类名称不能为空',
        icon: 'none'
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSortList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})