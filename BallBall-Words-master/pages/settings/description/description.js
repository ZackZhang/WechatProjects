// pages/settings/description/description.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appfunction: "做这个小程序的原因：" + '\n' +
    "1.手机内存不够" + '\n' +
    '很多时候，我并不想用功能太多的单词软件去背单词，因为我只会用其中背单词的部分，却要给其他功能腾出空间，对不起，我的内存不够！同时，背单词时间有限，能即用即抛是最好的，因此我计划按照单元的方式将单词分块，一个单元二十多个单词左右，背完就扔，留到脑子里就行，还可以自己控制自己进度。' + '\n' +
    "2.重复单词不可控" + '\n' +
    "确实，按照记忆曲线去背单词有效，但是我不喜欢学三十个单词要复习近两百个单词的设置"+'\n'+
    "3.我想要单词一起背" + '\n' +
    "由于在学日语，背日语单词和英语单词分开两个软件，我不喜欢，都是背单词，干嘛分得这么清楚呢",
    appfuture: "小程序的预期：" + '\n' +
    "1.首先是解决自己的需求（笑）" + '\n' +
    '2.然后是解决的大家的需求' + '\n' +
    "如果使用了这个小程序的大家有什么想背的单词，什么语言都可以，只要给我提供单词表，我也可以加进来满足大家的需求，有这个需求的朋友可以在用户反馈里留下联系方式，我会联系你的。" + '\n' +
    "3.最后做好这个小程序" + '\n' +
    '作为一个市场上的小程序，能为大家提供便利是最好的，如果大家有任何建议或想要参与这个小程序，也可以在用户反馈中说明。这个项目在初步成形后会在github开源。',
    image:'../../../images/good.png',
    imgalist: ['https://www.osinglar.top/Content/good.png', 'https://www.osinglar.top/Content/good.png'],  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.imgalist, // 当前显示图片的http链接     
      urls: this.data.imgalist // 需要预览的图片http链接列表     
    })
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