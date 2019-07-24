// miniprogram/pages/menu/menu.js
//行高
var food_row_height = 75;
//最大行数
var max_scroll_length = 5;
//标题栏高度
var cart_offset = 63;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    //显示目前的菜单，跟随搜索改变
    showmenu: [],
    //记录用户是否选择了这个菜，不随搜索改变
    menu: [],
    inputShowed: false,
    inputVal: "",
    selected: 0,
    cost: 0,
    //用户浏览已选择的商品
    showCart: false,
    animationData: null,
    foodChoosed: [],
    cartHeight: 667,
    //菜单页面高度
    foodPageHeight: 0,
    pageIndex: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // - 60 - 100
        var foodPageHeight = (res.windowHeight * 750 / res.windowWidth)
        that.setData({
          foodPageHeight: foodPageHeight,
        })
      }
    })
    that.getMenuList();
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

  getMenuList() {
    var that = this
    const db = wx.cloud.database()
    db.collection('menu').get().then(res => {
      console.log(res)
      that.setData({
        showmenu: res.data
      })
    })
  },

  turnMenu: function (e) {
    var that = this
    that.setData({
      selected: e.currentTarget.dataset.index
    })
  },

  removeFromTrolley: function (e) {
    var info = this.data.showmenu;
    var foodNum = this.data.foodChoosed;
    if (e.currentTarget.dataset.productid !== undefined) {
      for (var i = 0; i < foodNum.length; i++) {
        if (foodNum[i].id === e.currentTarget.dataset.productid) {
          var nowFood = foodNum[i]
          break;
        }
      }
    } else {
      var nowFood = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    }

    //购物车数目减一
    nowFood.numb--;
    if (nowFood.numb === 0) {
      var deleted = -1;
      for (var index = 0; index < foodNum.length; index++) {
        if (foodNum[index] === nowFood) {
          deleted = index;
          break;
        };
      }
      foodNum.splice(deleted, 1)
    }

    this.setData({
      cost: Number((this.data.cost - nowFood.price).toFixed(2)),
      showmenu: info,
      foodChoosed: foodNum
    })
  },

  addToTrolley: function (e) {
    //购物车一栏中增加食物
    var info = this.data.showmenu;
    var foodNum = this.data.foodChoosed;

    if (e.currentTarget.dataset.productid !== undefined) {
      for (var i = 0; i < foodNum.length; i++) {
        if (foodNum[i].id === e.currentTarget.dataset.productid) {
          var nowFood = foodNum[i]
          break;
        }
      }
    } else {
      //正常点餐界面增加食物
      var nowFood = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    }

    //购物车数目+1
    nowFood.numb++;
    if (nowFood.numb === 1) {
      foodNum.push(nowFood)
    }

    const newCost = this.data.cost + nowFood.price
    this.setData({
      cost: Number(newCost.toFixed(2)),
      showmenu: info,
      foodChoosed: foodNum
    })
  },

  openCart: function () {
    var that = this;
    if (that.data.showCart) {
      return;
    }
    var allItemsHeight = (that.data.foodChoosed.length + 1) * food_row_height
    var scrollHeight = that.data.foodChoosed.length < max_scroll_length ? allItemsHeight :
      (max_scroll_length + 1) * food_row_height
    var cartHeight = scrollHeight + cart_offset;
    var translateY = cartHeight + 100
    wx.getSystemInfo({
      success: function (res) {
        //转换成px单位，100rpx是购物车导航栏高度
        translateY = Number(translateY * (res.windowWidth / 750))
      }
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    })
    that.animation = animation
    animation.translateY(-1 * translateY).step()
    this.setData({
      scrollHeight: scrollHeight,
      cartHeight: cartHeight,
      showCart: !that.data.showCart,
      animationData: animation.export(),
    })

  },

  closeCart: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0
    })
    that.animation = animation
    animation.translateY(that.data.translateY).step()
    this.setData({
      showCart: !that.data.showCart,
      animationData: animation.export(),
    })
  },

  gotoPay: function (e) {
    var that = this;
    if (that.data.cost > 0) {
      wx.showToast({
        title: '准备支付',
        icon: 'loading',
        duration: 1000
      })
      var userInfo = wx.getStorageSync("userInfo")
      var foodInfoList = that.data.foodChoosed.map((item) => {
        return {
          'userName': userInfo.nickName,
          'foodName': item.foodName,
          'isReady': false,
          'isFinished': false,
          'getTime': new Date(),
          'numb': item.numb,
          'price': item.price
        }
      });
      wx.request({
        url: myUrl + '/hasPermission?nickName=' + userInfo.nickName,
        method: 'GET',
        success: function (res) {
          if (res.data === false) {
            wx.showToast({
              title: '无权限',
              icon: 'fail',
              duration: 1000
            })
          } else {
            var myHash = md5(userInfo.nickName + myKey)
            wx.request({
              url: myUrl + '/insertFoodInfo?myHash=' + myHash,
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              data: {
                'list': foodInfoList,
                'openId': wx.getStorageSync('openid'),
                'sessionKey': wx.getStorageSync('session_key'),
              },
              success: function (res) {
                if (res.data == "success") {
                  wx.showToast({
                    title: '下单成功',
                    icon: 'success',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/order/order'
                    })

                  }, 1000)
                } else {
                  wx.showToast({
                    title: '权限错误，联系开发者',
                    icon: 'none',
                    duration: 1000
                  })
                }
              },
              fail: error => {
                wx.showToast({
                  title: '下单失败',
                  icon: 'fail',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                }, 1000)
              }
            })
          }
        },
        fail: err => {
          return
        }
      })
    }
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