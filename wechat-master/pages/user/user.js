var utils = require('../../utils/util.js');
var $ = require('../../utils/ajax.js');
var api = require('../../config/api.js');

//获取应用实例
const app = getApp();
const works = [{
    id: 1,
    label: '历史记录',
    icon: 'https://www.yanda123.com/app/time.png',
    url: '/pages/user/history/history'
  },
  {
    id: 2,
    label: '我的收藏',
    icon: 'https://www.yanda123.com/app/collection_fill.png',
    url: '/pages/user/collect/collect'
  },
  {
    id: 3,
    label: '消费记录',
    icon: 'https://www.yanda123.com/app/redpacket.png',
    url: '/pages/user/payrecord/payrecord'
  },
  // { id: 4, label: '帮助反馈', icon: 'https://www.yanda123.com/app/feedback.png', url: '/pages/msg/msg_success' },
  {
    id: 4,
    label: '成为会员',
    icon: 'https://www.yanda123.com/app/vip.png',
    url: '/pages/user/vip/vip'
  },
  {
    id: 5,
    label: '试题下载',
    icon: 'https://www.yanda123.com/app/paper.png',
    url: '/pages/paper/paper?paperType=1'
  },
  {
    id: 6,
    label: '课件下载',
    icon: 'https://www.yanda123.com/app/ppt.png',
    url: '/pages/paper/paper?paperType=2'
  },
  {
    id: 7,
    label: '更多设置',
    icon: 'https://www.yanda123.com/app/setting.png',
    url: '/pages/setting/mySetting/mySetting'
  }
]

Page({
  data: {
    workCards: works,
    userInfo: {},
    isVip: false,
    expireDay: 0,
    isForever: false,
    openid: '',
    session_key: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canUserLoad: wx.canIUse('showLoading')
  },
  //事件处理函数
  handleWorkClick: function(e) {
    if (this.data.userInfo && this.data.userInfo.userId) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      utils.quickTip('请先登录');
    }
  },
  /**
   * 跳转到账号设置页面
   */
  toAccountSetting: function(e) {
    wx.navigateTo({
      url: '/pages/setting/account/account',
    });
  },

  //每次进入页面
  onShow: function() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      this.setData({
        userInfo: {},
        hasUserInfo: false
      })
    } else {
      let isVip = utils.isVip(userInfo);
      let expireDay = 0;
      let isForever = false;
      if (isVip) {
        expireDay = utils.expireToDay(userInfo.vipCard.expTime);
        isForever = userInfo.vipCard.isForever;
      }
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        isVip: isVip,
        expireDay: expireDay,
        isForever: isForever
      })
    }
  },
  onLoad: function() {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      var that = this;
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.initUserInfo(res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      var that = this;
      wx.getUserInfo({
        success: res => {
          that.initUserInfo(res.userInfo);
        }
      })
    }
  },
  getUserInfo: function(e) {
    let userInfo = e.detail.userInfo;
    this.initUserInfo(userInfo);
  },
  /**
   * 通过微信用户信息在后台注册随机账号，并与微信做绑定
   */
  register: function(openId, nickName, avatar, gender) {
    $.post({
      url: api.UserRegister,
      data: {
        openId: openId,
        nickName: nickName,
        avatar: avatar,
        sex: gender
      }
    }).then((res) => {
      let data = res.data;
      if (data.status == 200) {
        let userInfo = data.data;
        this.login(userInfo.userName, userInfo.password);
      } else {
        utils.quickTip('注册微信用户失败:' + data.message);
      }
    })
  },
  /**
   * 在后台进行登录
   */
  login: function(userName, password) {
    $.post({
      url: api.UserLogin,
      data: {
        userName: userName,
        password: password
      }
    }).then((res) => {
      if (this.data.canUserLoad) {
        wx.hideLoading();
      }
      let result = res.data;
      if (result.status === -1) {
        utils.quickTip(result.message);
      } else if (result.status === 200) {
        let ydUser = result.data.userInfo;
        app.globalData.userInfo = ydUser;
        // 判断用户是否已绑定手机号，若无则强制跳转到绑定手机界面
        if (!ydUser.mobile) {
          wx.showToast({
            title: '您还未绑定手机号',
            icon: 'none',
            mask: true,
            success: function() {
              setTimeout(function() {
                wx.navigateTo({
                  url: '/pages/setting/mobile/mobile'
                });
              }, 1000);
            }
          });
          return;
        } else {
          wx.setStorageSync('userInfo', ydUser);
          wx.setStorageSync('token', result.data.token);

          let isVip = utils.isVip(ydUser);
          let expireDay = 0;
          let isForever = false;
          if (isVip) {
            expireDay = utils.expireToDay(ydUser.vipCard.expTime);
            isForever = ydUser.vipCard.isForever;
          }
          this.setData({
            userInfo: ydUser,
            hasUserInfo: true,
            isVip: isVip,
            expireDay: expireDay,
            isForever: isForever
          });
        }

      } else {
        utils.quickTip('网络错误，请稍后再试');
      }
    }).catch((err) => {
      if (this.data.canUserLoad) {
        wx.hideLoading();
      }
      console.log(err);
    })
  },
  /**
   * 在微信获取用户信息后进行用户信息初始化
   */
  initUserInfo: function(userInfo) {
    if (this.data.canUserLoad) {
      wx.showLoading({
        title: '正在登录',
        mask: true
      })
    }
    if (userInfo) {
      var that = this;
      // 调用login获取code，通过code获取openid，通过openid和当前用户做绑定
      wx.login({
        success: function(res) {
          $.get({
            url: api.UserGetOpenId,
            data: {
              js_code: res.code
            }
          }).then((res) => {
            let data = res.data.data;
            that.setData({
              session_key: data.session_key,
              openid: data.openid
            });
            wx.setStorageSync('openid', data.openid); // 存储openid
            // 通过openid查询微信用户和是否存在
            $.get({
              url: api.UserCheckExist,
              data: {
                openId: that.data.openid
              }
            }).then((res) => {
              let data = res.data;
              if (data.status == 200) {
                let yandaUser = data.data;
                if (yandaUser) {
                  // 用户已存在，用该用户在后台登录
                  console.log('用户ID=' + yandaUser.userId);
                  that.login(yandaUser.userName, yandaUser.password);
                } else {
                  // 该微信账号未在yanda注册账号，为其自动生成账号，并绑定openid,然后在yanda登录
                  let nickName = utils.filteremoji(userInfo.nickName);
                  that.register(that.data.openid, nickName, userInfo.avatarUrl, userInfo.gender);
                }
              }
            });
          })
        }
      });
    } else {
      utils.quickTip('无法获取用户信息');
    }
  },
  vipLogin: function() {
    wx.navigateTo({
      url: '/pages/user/login/login'
    });
  }
})