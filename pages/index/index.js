const app = getApp()
Page({

  //页面的初始数据
  data: {
    wechat: "../../images/wechat.png",
    moments: "../../images/moments.png",
    inputValue: "修得莲心不染尘",
    maskHidden: false,
    avatar: "../../images/nankai.png",
    name: "一位神秘的南开人",
    qrcode: ""
  },

  //获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    //绘制背景
    var background = "../../images/bgimg.jpg";
    context.drawImage(background, 0, 0, 375, 667);
    //绘制用户名
    var name = that.data.name;
    context.setFontSize(20);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 200, 180);
    context.stroke();
    //绘制荷花寄语
    var message = "“" + that.data.inputValue + "”";
    context.setFontSize(20);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(message, 246, 300);
    context.stroke();
    //绘制头像
    var avatar = that.data.avatar;
    context.arc(187, 86, 35, 0, 2 * Math.PI)
    context.clip();
    context.drawImage(avatar, 152, 51, 70, 70);
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '图片生成失败',
            icon: 'none',
            duration: 2000
          })
        }
      });
    }, 200);
  },

  //点击保存到相册
  save: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                maskHidden: false
              })
            }
          }
        })
      },
      fail: function () {
        that.setData({
          maskHidden: false
        })
        wx.showToast({
          title: "保存失败",
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //取消保存图片
  cancel: function () {
    var that = this;
    that.setData({
      maskHidden: false
    })
    wx.showToast({
      title: "取消保存",
      icon: 'none',
      duration: 2000
    })
  },

  //用户点击右上角分享
  onShareAppMessage: function (res) {
    return {
      title: "南开大学荷花节",
      success: function (res) {
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: "分享失败",
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  //获取授权
  bindGetUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo) {
      that.setData({
        name: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      })
      wx.downloadFile({
        url: e.detail.userInfo.avatarUrl,
        success: function (res) {
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath
            })
          }
        }
      })
      wx.showToast({
        title: '授权成功',
        icon: 'loading',
        duration: 2000
      });
    }
    else {
      wx.showToast({
        title: '未获取授权',
        icon: 'loading',
        duration: 2000
      });
    }
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 2000)
  },
})