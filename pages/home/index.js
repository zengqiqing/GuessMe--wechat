//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // bacImage:[
    //   {nowImg:"/images/home_one.jpg"},
    //   { nowImg: "/images/home_two.png" }
    // ],
    actionSheetShow:true,//弹窗
    actionSheetItems: ['相机拍摄', '相册'],
  },
  
  onLoad: function () {
    app.fetch({
      url:`https://tu.juher.cn/account/v1/util/upToken`
    },'POST').then(res=>{
      wx.setStorageSync("token", res.data);
    })
    // let randomkey = Math.round(Math.random() * 1);
    // this.setData({
    //   randomkey: randomkey
    // })

    wx.getSystemInfo({
      success: (res) => {
         let winHeight =  res.windowHeight
         let imgHeight = 600
        let imgScale =winHeight / imgHeight
      }
    })
  },
  onHide:function(){
    let { tempFilePaths}=this.data
    this.setData({
      tempFilePaths: []
    })
  },
//上传图片方式弹出
onChangeImage() {
  this.setData({
    actionSheetShow: false,
  })
},
//关闭上传图片弹窗
closePhotoPop(){
  this.setData({
    actionSheetShow: true,
  })
},
//删除头像
  closeHeader(){
    let {tempFilePaths} =this.data
     this.setData({
       tempFilePaths:""
     })
  },


  //上传图片
upLoadPhoto(e) {
  let {
    name
  } = e.currentTarget.dataset;
  app.chooseImage(name,(res)=>{
    this.setData({
      tempFilePaths:res
    })
  })
  this.setData({
    actionSheetShow: true
  })
},
  //输入昵称
  onInput(e){
    this.setData({
      customerName: e.detail.value
    })
  },
  //选择性别
  genderChoose(e){
    this.setData({
      customerGender:e.currentTarget.dataset.gender
    })
  },
  //提交表单信息
  bindTakeForm(){
    let { tempFilePaths,customerName, customerGender}=this.data
    if (!tempFilePaths){
      app.showToast("请上传您的美照！")
      return
    } else if (!customerName){
      app.showToast('请输入您的昵称!')
      return
    } else if (!customerGender){
      app.showToast('请选择您的性别!')
      return
    }
    tempFilePaths = tempFilePaths || ""
    let postData = { tempFilePaths, customerName, customerGender}
    postData = JSON.stringify(postData)
    wx.navigateTo({
      url: `/pages/shareMe/index?postData=${postData}`,
    })
  },
 
})
