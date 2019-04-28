const app = getApp()

Page({
  data: {
    mapImage: '/images/1.png',
  },

  onLoad: function () {
    let that = this
    let device = wx.getSystemInfoSync()
    let windowHeight = device.windowHeight
    let windowWidth = device.windowWidth
    let areas = require('../../src/data.js').areas
    wx.getImageInfo({
      src: that.data.mapImage,
      success: function (res) {
        let imageHeight = res.height
        let imageWidth = res.width
        let height = windowHeight
        let width = imageWidth / imageHeight * height
        let x = (windowWidth - width) / 2
        that.setData({
          areas: areas,
          windowHeight: height,
          height: height,
          originalHeight: height,
          windowWidth: windowWidth,
          width: width,
          originalWidth: width,
          x: x,
          y: 0,
        })
      }
    })
  },

  scale: function (event) {
    let that = this
    let scale = event.detail.value
    let height = that.data.originalHeight * scale
    let width = that.data.originalWidth * scale
    let x = (that.data.windowWidth - width) / 2
    let y = (that.data.windowHeight - height) / 2
    that.setData({
      height: that.data.originalHeight * scale,
      width: that.data.originalWidth * scale,
      x: x,
      y: y,
    })
  }
})
