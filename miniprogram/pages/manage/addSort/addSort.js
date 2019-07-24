// miniprogram/pages/manage/addSort/addSort.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sortList: [],
    newSortName: ''
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