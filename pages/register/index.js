import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    filed_phone: "",
    filed_password: "",
    filed_password2: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  ,
  
  phone_change: function (e) {
    this.setData({
      filed_phone: e.detail
    })
  }
  ,
  password_change: function (e) {
    this.setData({
      filed_password: e.detail
    })
  }
  ,
  password_change2: function (e) {
    this.setData({
      filed_password2: e.detail
    })
  }

  , 
  doregister:function(){//提交注册
    if (this.data.filed_phone == "") {
      Toast('请输入手机号')
      return
    }else{
      var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phonereg.test(this.data.filed_phone)) {
        Toast('手机号不正确')
        return;
      }
     
    }
    if (this.data.filed_password == "") {
      Toast('请输入密码')
      return
    }
    if (this.data.filed_password2 == "") {
      Toast('请再次输入密码')
      return
    }
    if(this.data.filed_password != this.data.filed_password2){
      Toast("两次密码输入不一致")
      return
    }
    this.setData({
      isLoading: true
    })

    let that = this
    let url = app.globalData.serverHost + "/userController/register"
    app.requestPostData(url,
      {
        "phone": this.data.filed_phone,
        "password": this.data.filed_password
      },
      function(res){
        that.setData({
          isLoading: false
        })
        if (res.data.success) {
          Toast.clear
          Toast.success(res.data.msg)
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        } else {
          Toast.fail(res.data.msg)
        }
      }
    )


  }

})