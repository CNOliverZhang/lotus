const app = getApp()

Page({
  data: {
    mapImage: '/images/map.jpg',
  },

  onLoad: function () {
    let that = this
    //读取所有位置信息
    let positions = require('../../src/data.js').positions
    //从本地存储读取已打卡地点
    let checked = wx.getStorageSync('checked')
    if (checked) {
      //已打卡地点的位置信息做标记
      for (let i = 0; i < checked.length; i++) {
        positions[checked[i]]['checked'] = true
      }
    } else {
      //未从本地存储读取到已打卡地点则将已打卡地点列表置为空列表
      checked = []
    }
    //获取地图宽高和设备宽高，使地图初始高度与设备高度相同
    let device = wx.getSystemInfoSync()
    let windowHeight = device.windowHeight
    let windowWidth = device.windowWidth
    wx.getImageInfo({
      src: that.data.mapImage,
      success: function (res) {
        let imageHeight = res.height
        let imageWidth = res.width
        let height = windowHeight
        let width = imageWidth / imageHeight * height
        let x = (windowWidth - width) / 2
        that.setData({
          positions: positions,
          checked: checked,
          windowHeight: height,
          height: height,
          originalHeight: height,
          windowWidth: windowWidth,
          width: width,
          originalWidth: width,
          x: x,
          y: 0,
          currentX: x,
          currentY: 0,
          scale: 1,
        })
      }
    })
  },

  move: function (event) {
    this.setData({
      currentX: event.detail.x,
      currentY: event.detail.y,
    })
  },

  scale: function (event) {
    let that = this
    let scale = that.data.scale
    if (event.currentTarget.dataset.action == -1) {
      if (scale == 1) {
        wx.showToast({
          title: '已缩到最小',
          icon: 'none'
        })
        return
      }
      scale -= 1
    } else {
      if (scale == 4) {
        wx.showToast({
          title: '已放到最大',
          icon: 'none'
        })
        return
      }
      scale += 1
    }
    let height = that.data.originalHeight * scale
    let width = that.data.originalWidth * scale
    let x = that.data.windowWidth / 2 - ((that.data.windowWidth / 2 - that.data.currentX) * (width / that.data.width))
    let y = that.data.windowHeight / 2 - ((that.data.windowHeight / 2 - that.data.currentY) * (height / that.data.height))
    that.setData({
      x: x,
      y: y,
      height: height,
      width: width,
      scale: scale
    })
  }
})
