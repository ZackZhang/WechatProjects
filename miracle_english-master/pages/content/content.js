// pages/content/content.js
const APP = getApp()
const AUDIOMANAGER = getApp().globalData.global_bac_audio_manager.manage
const AUDIO = getApp().globalData.global_bac_audio_manager

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    showModal2: false,
    showModal3: false,
    soundPlay: false,
    // 音频相关,现在数据源是写死的，动态获取参考这里：https://www.cnblogs.com/luxiaoyao/p/9371366.html
    is_play: false,
    is_loading: false,
    is_first_page: true,
    is_last_page: false,
    article_id: '',
    current_process: '00:00',
    slider_value: 0,
    total_process: '00:00',
    slider_max: 0,
    is_loop: false,
    is_moving_slider: false,
    is_ended: true,
    audio_article: {
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46',
      nextArticleId: '',
      preArticleId: ''
    },
    // 模拟造句
    zaojuList: [
      {
        id: 1,
        en: 'Did you do like you should?',
        ch: '试写：你好好上学了吗？',
        cankao: 'Did you go to school like you should?'
      },
      {
        id: 2,
        en: 'How did it taste?Yum, Yum, Yum.',
        ch: '试写：妈妈声音听起来怎么样？温柔温柔又温柔！',
        cankao: 'How does Mum’s voice sound?Gentle, gentle, gentle!'
      }
    ],
    answerIndex: 0,
    answerList: [
      {
        id: 'A',
        text: '奇迹；名词'
      },
      {
        id: 'B',
        text: '奇迹；动词'
      },
      {
        id: 'C',
        text: '好奇；名词'
      },
      {
        id: 'D',
        text: '好奇；动词'
      }
    ]
  },

  /**
   * 答案切换
   */
  tapAnswer: function (options) {
    let index = options.currentTarget.dataset.index;
    this.setData({
      answerIndex: index
    })
  },

  /**
   * 打开分享弹窗
   */
  showModal: function () {
    this.setData({
      showModal: true
    })
  },

  /**
   * 关闭分享弹窗
   */
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },

  /**
   * 打开视频弹窗
   */
  showModal3: function () {
    this.setData({
      showModal3: true
    })
  },

  /**
   * 关闭视频弹窗
   */
  hideModal3: function () {
    this.setData({
      showModal3: false
    })
  },

  /**
   * 跟读
   */
  tapGendu: function () {
    if (this.data.soundPlay) {
      this.setData({
        soundPlay: false
      })
    } else {
      this.setData({
        soundPlay: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    //   request_param = {
    //     articleId: e.articleId
    //   }

    // this.setData({
    //   article_id: e.articleId
    // })

    AUDIOMANAGER.onPlay(() => {
      setTimeout(() => {
        that.setData({
          is_loading: true
        })
      }, 300)
    })

    // let response = res.data.data.information

    // 如果不是从悬浮按钮播放，就重新赋值
    // if (e.articleId == AUDIO.id && AUDIO.is_play) {
    //   wx.seekBackgroundAudio({
    //     position: Math.floor(AUDIO.time)
    //   })
    // } else {
    //   audio_background_play(/*response*/that.data.audio_article)
    // }

    // 置灰上一首下一首
    // if (response.preArticleId == 0) {
    //   that.setData({
    //     is_first_page: true
    //   })
    // }
    // if (response.nextArticleId == 0) {
    //   that.setData({
    //     is_last_page: true
    //   })
    // }

    //背景音频播放进度更新事件
    AUDIOMANAGER.onTimeUpdate(() => {
      if (!that.data.is_moving_slider) {
        that.setData({
          current_process: format(AUDIOMANAGER.currentTime),
          slider_value: Math.floor(AUDIOMANAGER.currentTime),
          total_process: format(AUDIOMANAGER.duration),
          slider_max: Math.floor(AUDIOMANAGER.duration)
        })
      }
      AUDIO.time = AUDIOMANAGER.currentTime
    })

    // 背景音频播放完毕
    AUDIOMANAGER.onEnded(() => {
      if (!that.data.is_loop) {
        that.next()
      } else {
        // 单曲循环
        that.setData({
          slider_value: 0,
          current_process: '00:00',
        })
        audio_background_play(/*response*/that.audio_article)
      }
    })
  },

  // 拖动进度条，到指定位置
  hanle_slider_change(e) {
    const position = e.detail.value
    this.seekCurrentAudio(position)
  },
  // 拖动进度条控件
  seekCurrentAudio(position) {
    // 更新进度条
    let that = this

    wx.seekBackgroundAudio({
      position: Math.floor(position),
      success: function () {
        AUDIOMANAGER.currentTime = position
        that.setData({
          current_process: format(position),
          slider_value: Math.floor(position)
        })
      }
    })
  },
  // 进度条滑动
  handle_slider_move_start() {
    this.setData({
      is_moving_slider: true
    });
  },
  handle_slider_move_end() {
    this.setData({
      is_moving_slider: false
    });
  },
  // 点击播放暂停
  audio_play: function () {
    let that = this

    if (this.data.is_play) {
      that.setData({
        is_play: false
      })
      wx.pauseBackgroundAudio()
    } else if (!this.data.is_play && this.data.is_ended) { // 这里是判断如果循环播放结束，没有下一首，重新播放 is_ended  是否是最后一首
      audio_background_play(that.data.audio_article)
      that.setData({
        is_play: true,
        is_ended: false
      })
    } else if (!this.data.is_play) {
      that.setData({
        is_play: true
      })
      wx.playBackgroundAudio()
    }
    AUDIO.is_play = !AUDIO.is_play
  },
  // 点击是否循环
  play_loop: function () {
    let that = this

    if (this.data.is_loop) {
      that.setData({
        is_loop: false
      })
    } else {
      that.setData({
        is_loop: true
      })
    }
  },

  // 上一首
  // prev: function () {
  //   let that = this

  //   if (that.data.audio_article.preArticleId != 0) {
  //     wx.redirectTo({
  //       url: '/pages/audio_article/audio_article?articleId=' +
  //         that.data.audio_article.preArticleId
  //     })
  //   }
  // },
  // 下一首
  // next: function () {
  //   let that = this

  //   if (that.data.audio_article.nextArticleId != 0) {
  //     wx.redirectTo({
  //       url: '/pages/audio_article/audio_article?articleId=' +
  //         that.data.audio_article.nextArticleId
  //     })
  //   } else { // 如果是最后一首
  //     that.setData({
  //       is_play: false,
  //       slider_value: 0,
  //       current_process: '00:00',
  //       is_ended: true
  //     })
  //     AUDIO.is_play = false
  //   }
  // },
  onUnload: function () {
    // 动态切换悬浮按钮的动态
    if (AUDIO.is_play) {
      APP.globalData.is_active = true
    } else {
      APP.globalData.is_active = false
    }
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

// 时间格式化
function format(t) {
  let time = Math.floor(t / 60) >= 10 ? Math.floor(t / 60) : '0' + Math.floor(t / 60)

  t = time + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
  return t
}
// 音频播放
function audio_background_play(response) {
  // AUDIOMANAGER.src = response.urlCompressed ? response.urlCompressed : response.audioLink // 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
  // AUDIOMANAGER.title = response.articleName // 音频标题
  // AUDIOMANAGER.epname = response.lessonName // 专辑名
  // AUDIOMANAGER.singer = '****' // 歌手名
  // AUDIOMANAGER.coverImgUrl = response.poster // 封面图url

  AUDIOMANAGER.title = '此时此刻'
  AUDIOMANAGER.epname = '此时此刻'
  AUDIOMANAGER.singer = '许巍'
  AUDIOMANAGER.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
  // 设置了 src 之后会自动播放
  AUDIOMANAGER.src = response.src
}