//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    levelCurrent: 0,
    levelList: [
      {
        level: '奇迹1级',
        total: '0-800词汇量'
      },
      {
        level: '奇迹2级',
        total: '500-1500词汇量'
      },
      {
        level: '奇迹3级',
        total: '1500-3000词汇量'
      }
    ],
    banbenCurrent: 0,
    banbenList: [
      {
        name: '人教版'
      },
      {
        name: '北师大版'
      },
      {
        name: '外研社版'
      },
      {
        name: '其他'
      }
    ]
  },

  // 级别切换
  tapLevel: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      levelCurrent: index
    })
  },

  // 教材版本切换
  tapBanben: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      banbenCurrent: index
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
