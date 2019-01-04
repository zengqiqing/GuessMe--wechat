const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{},
    },
    percent:{
      type:Number,
      value:0,
    },
    price:{
      type:String,
      value:""
    },
    pickCode:{
      type:String,
      value:"",
    },
    showCanvas:{
      type:Boolean,
      value:true,
    }
  },

  data: {
    shareBtn:"/images/shareBtn.jpg",
    serve:"/images/serve.jpg",
  },
  ready() {
      let that = this
      let {item,pickCode}=this.data
    wx.downloadFile({
      url: item.tempFilePaths, // 仅为示例，并非真实的资源
      success(res) {
        console.log('eee',res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        // if (res.statusCode == 200) {
          that.setData({
              newFilePath: res.tempFilePath
            })
        // }
      }
    })
    wx.downloadFile({
      url: pickCode, // 仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode == Number(200)) {
          that.setData({
              newPickCode: res.tempFilePath
            })
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        let height = res.screenHeight
        let qrcodeHeight = height - (height * 0.1) - 10
        this.setData({
          windowHeight: height,
          windowWidth: res.windowWidth,
          qrcodeHeight: qrcodeHeight,
          sysinfo: res,
          rpx : res.windowWidth/375
        })
      }
    })
      this.drawCanvas()
  },

  attached(){
  },

  methods: {

    //画布
    drawCanvas(){
      setTimeout(()=>{
        let { windowHeight, rpx, windowWidth,qrcodeHeight, sysinfo, newPickCode, item,newFilePath, price, percent, shareBtn, serve}=this.data
        console.log('xxx', newFilePath,serve)
        let subTitle = `您的售价已经打败了全国${percent}%的${item.customerGender == 0 ? "美女" : "帅哥"}....`
        let shipType = "快递运费10RMB 月销78689"
        const ctx = wx.createCanvasContext('myCanvas', this)
        var canvasW = windowWidth

        var canvasY = qrcodeHeight
        
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, canvasW, canvasY)
        // 商品图
        ctx.drawImage(newFilePath, 0, 0, (canvasW * 1), (canvasY * 0.5))
        // 二维码
        ctx.drawImage(newPickCode, (canvasW - (canvasY * 0.23)), canvasY * 0.4, canvasY * 0.15 + 1, canvasY * 0.15 +1)
        //价钱
        ctx.setFontSize(16*rpx)
        ctx.setFillStyle('#ff0000')
        // ctx.font = 'normal bold 14px sans-serif';
        ctx.fillText("￥" + price, 15, canvasY * 0.54)
        //昵称
        ctx.setFillStyle('#333')
        ctx.fillText(item.customerName, 15, canvasY * 0.57)
        //打败值
        ctx.setFontSize(14 * rpx)
        ctx.setFillStyle('#999')
        ctx.fillText(subTitle, 15, canvasY * 0.6)
        //运费
        ctx.setFontSize(10*rpx)
        ctx.setFillStyle('#999')
        ctx.fillText(shipType, 15, canvasY * 0.63)
        //分享按钮
        ctx.drawImage(shareBtn, (canvasW * 0.75), canvasY * 0.58, canvasY * 0.08, canvasY * 0.05 )
        //服务图
        ctx.drawImage(serve,  0, canvasY * 0.65, canvasW * 0.92, canvasY * 0.23)

        ctx.draw()
      },3000)
    },

   
    //保存图片
    saveImageToPhotosAlbumAction() {
      let {tempFilePaths } = this.data
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: (res) => {
          var tempFilePath = res.tempFilePath;
          this.downloadFile(tempFilePath)
        },
        fail: function (res) {
          console.log('保存图片失败',res);
        }
      }, this)
    },

     downloadFile(imgUrl) {
       let { showCanvas}=this.data
      wx.saveImageToPhotosAlbum({
        filePath: imgUrl,//res.tempFilePath,
        success: (res) => {
          showCanvas = false
          app.showToast('保存成功!')
          this.triggerEvent('DrawCanvas', { showCanvas }, {})
        },
        fail(res) {
        }
      })
    },

    //关闭画布
    onCloseCanvas(){
      let { showCanvas } = this.data
      showCanvas = false
      this.triggerEvent('DrawCanvas', { showCanvas }, {})
    }

  }
})
