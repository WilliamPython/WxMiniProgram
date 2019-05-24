const MOVIE_URL = 'http://t.yushu.im/v2/movie/top250';
let appDatas = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '电影列表加载中...',
      icon: 'loading',
      duration: 3000
    })
    wx.request({
      url: MOVIE_URL,
      success: (res) => {
        this.setData({
          movies: res.data.subjects
        });
        wx.hideToast();
        appDatas.globalData.movies = res.data.subjects;
      }
    });
  }
})