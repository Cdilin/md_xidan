import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading :false,
    filed_phone:"",
    filed_password:""
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
    var that = this
    
    wx.getStorage({
      key: 'phone',
      success(res) {
        that.setData({
          filed_phone:res.data
        })
        // console.log(res.data)
      }
    })

    wx.getStorage({
      key: 'password',
      success(res) {
        that.setData({
          filed_password: res.data
        })
        // console.log(res.data)
      }
    })

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
  dologin:function(){
    if(this.data.filed_phone == ""){
      Toast('请输入手机号')
      return
    }
    if (this.data.filed_password == "") {
      Toast('请输入密码')
      return
    }

    this.setData({
      isLoading: true
    })
    
    var that = this
    let params = "?username=" + this.data.filed_phone + "&password=" + this.data.filed_password
    let url = app.globalData.serverHost + "/tokens" + params

    app.requestPostData(url,{},
    function(res){
      if (res.data.success) {
        Toast.clear
        app.globalData.token = res.data.obj
        wx.setStorage({
          key: "phone",
          data: that.data.filed_phone
        })
        wx.setStorage({
          key: "password",
          data: that.data.filed_password
        })

        wx.switchTab({
          url: '../index/index',
        })
      } else {
        Toast.fail(res.data.msg)
      }
    })
  }
  ,
  toregister: function () {
    wx.navigateTo({
      url: '../register/index',
    })
  }
  ,
  phone_change:function(e){
    // console.log(e)
    this.setData({
      filed_phone:e.detail
    })
  }
  ,
  password_change:function(e){
    this.setData({
      filed_password: e.detail
    })
  }

})