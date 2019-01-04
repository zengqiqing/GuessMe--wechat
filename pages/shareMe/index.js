// pages/shareMe/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickCode:"https://img.juher.cn/gh_57c885c6ee4e_258.jpg",//二维码
      showCanvas:false,//展示canvas
      serveData:[
        {
          name:"优惠",
          content:"满1元倒贴自己来回机票",
          work:"领券",
          style:0,
        },
        {
          name: "服务",
          content: "365天无理由退货，自己买机票飞过去.即使沟通",
          work: "",
          style:1,
        }
      ],
      bottomData:[
        {
          title:"店铺",
          btn_icon:"/images/shopicon.png",
        },
        {
          title: "客服",
          btn_icon: "/images/chaticon.png",
        },
        {
          title: "收藏",
          btn_icon: "/images/loveicon.png",
        },
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = JSON.parse(options.postData)
    let price=Math.floor(Math.random() * (100000000 + 1))
      price = this.getreallprice(price)
    this.setData({
      item : options,
      price: price,
      percent: Math.floor(Math.random() * (100 + 1)),
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
            shareHeight: res.windowHeight,
        })
      }
    })
  },
  onShow: function () {

  },
//点击头像，生成图片
  keepCanvas(){
    let { showCanvas} = this.data
    this.setData({
      showCanvas:!showCanvas
    })
  },
  //金额截取
  getreallprice (n){
    var b = parseInt(n).toString();
    var len = b.length;
    if(len<= 3){ return b; }
var r = len % 3;
return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");  
} ,

  //关闭canvas
  closeCanvas(){
    this.setData({
      showCanvas: true
      })
  },

  //保存分享图片到本地
  makeCanvas(e){
    this.setData({
      showCanvas:e.detail.showCanvas
    })
  },
  onShareAppMessage(res) {
    let { item}=this.data
    if (res.from === 'button') {
      // 来自页面内转发按
    }
    return {
      title: "把自己卖出去",
      imageUrl: this.data.pickCode,
      path: `/pages/shareMe/index?postData=${item}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
 
})