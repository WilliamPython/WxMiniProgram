const listDatas = require('../../datas/list-data.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    detailObj: {},
    isCollected: false,
    isMusicPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let index = options.index;
    this.setData({
      detailObj: listDatas.list_data[index],
      index
    });

    //获取收藏状态 isCollected:{0:true,1:false,...}
    let isCollected = wx.getStorageSync("isCollected");
    if (!isCollected) {
      //console.log("设置本地isCollected为{}");
      wx.setStorageSync("isCollected", {});
    } else {
      if (isCollected[index]) { //若收藏过则更新默认收藏状态
        this.setData({
          isCollected: true
        });
      }
    }

    //进入前判断该音乐是否在播放状态
    if (app.globalData.globalIsMusicPlay && app.globalData.globalIndex === index) {
      this.setData({
        isMusicPlay: true
      });
    }
    //有的音乐链接失效，测试时用手机注意下）
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    //监听音乐播放事件
    backgroundAudioManager.onPlay(() => {
      if (app.globalData.globalIndex === index) {
        this.setData({
          isMusicPlay: true
        });
      }
      app.globalData.globalIsMusicPlay = true;
      //console.log("监听背景音频播放事件，PageIndex=" + index + "," + app.globalData.globalIndex + '-' + app.globalData.globalIsMusicPlay);
    });
    //监听背景音频暂停事件
    backgroundAudioManager.onPause(() => {
      if (app.globalData.globalIndex === index) {
        this.setData({
          isMusicPlay: false
        });
      }
      app.globalData.globalIsMusicPlay = false;
      //console.log("监听背景音频暂停事件，PageIndex=" + index + "," + app.globalData.globalIndex + '-' + app.globalData.globalIsMusicPlay);
    });
  },

  /**
   * 收藏点击处理
   */
  handleCollection: function() {
    let isCollected = !this.data.isCollected;
    //更新收藏状态变量
    this.setData({
      isCollected
    });
    //反馈用户收藏信息
    let title = isCollected ? '收藏成功' : '取消收藏';
    wx.showToast({
      title,
      icon: 'success'
    });
    //更新或添加本地存储全局收藏状态 isCollected:{0:true,1:false,...}
    wx.getStorage({
      key: 'isCollected',
      success: (res) => { //isCollected本地有存储才有进入success回调函数
        let isCollected = res.data;
        let {
          index
        } = this.data;
        isCollected[index] = this.data.isCollected;
        wx.setStorage({
          key: 'isCollected',
          data: isCollected
        });
      }
    });
  },

  /**
   * 页面音乐切换处理
   */
  handleMusicPlay: function() {
    let isMusicPlay = !this.data.isMusicPlay;
    //更新音乐播放状态变量
    this.setData({
      isMusicPlay
    });
    let index = this.data.index;
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    if (isMusicPlay) {
      //src默认为空字符串，当设置了新的 src 时，会自动开始播放，目前支持的格式有 m4a, aac, mp3, wav。
      backgroundAudioManager.src = this.data.detailObj.music.dataUrl;
      backgroundAudioManager.title = this.data.detailObj.music.title;
      backgroundAudioManager.coverImgUrl = this.data.detailObj.music.coverImgUrl;
      //backgroundAudioManager.play();
      //第一次或者在其他页面点击页面播放图片时才会修改app.globalData.globalIndex
      if (app.globalData.globalIndex != index) {
        app.globalData.globalIndex = index;
        //console.log("开始听歌或者切歌");
      }
    } else {
      backgroundAudioManager.pause();
    }
  },
  /**
   * 页面内容分享处理（个人测试账号只能简单处理）
   */
  handleShare: function() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到QQ空间', '分享到微博'],
      success(res) {
        //console.log(res.tapIndex)
      },
      fail(res) {
        //console.log(res.errMsg)
      }
    });
  }
})