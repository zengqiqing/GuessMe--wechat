App({
  onLaunch: function () {
   
   
  globalData: {
    userInfo: null
  }
  },
   // 提示信息
  showToast(essMsg) {
    wx.showToast({
      title: essMsg,
      icon: 'none',
      duration: 1500
    })
  },

  //获取数据
  fetch(options, method = 'GET') {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        header: options.header || {
          "content-type": "application/json"
        },
        data: options.data || {},
        method: method,
        dataType: options.dataType || "json",
        success: function (e) {
          console.log('is success e', e)
          resolve(e.data)
        },
        fail: function (e) {
          console.log('is fail e', e)
          reject(e)
          wx.showModal({
            title: "网络请求出错",
            content: e.errMsg,
            success: function (e) {
              t.fail ? t.fail(e) : ''
            }
          })
        },
        complete: function (e) {

        }
      })
    })
  },
  //用户选择本地图片
  chooseImage(type,callback=()=>{}){
    let uploadTask = wx.chooseImage({
      count: 1, // 默认9
      sourceType: type == "相机拍摄" ? ['camera'] : ['album'], // 可以指定来源是相册还是相机，默认二者都有
      sizeType:['compressed'],
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        this.photoUpload(tempFilePaths[0],callback)
      }
    })
  },
//上传本地图片到服务器上
  photoUpload(src,callback=()=>{}){
    let token = wx.getStorageSync('token');
    let timestamp = Date.parse(new Date());
    wx.uploadFile({
      url: "https://up-z2.qiniup.com",
      filePath: src,
      name: 'file',
      formData: {
        'key':  timestamp+src.split('//')[1],
        'token': token
      },
      success: (res) => {
        let { key, statusCode, errMsg } = JSON.parse(res.data)
        // console.log('回调图片的具体路径',  "https://img.juher.cn/" + key)
        key = "https://img.juher.cn/" + key 
        // 回调图片的具体路径
        if (res.statusCode==200){
          callback(key)
        }else{
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      }, 
      fail: (res) => {
        console.dir(res)
      }
    })
  }




})