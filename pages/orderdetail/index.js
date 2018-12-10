const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID:"",
    hasList:false,
    orderGlassList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      orderID:options.id
    })
    getOrderDetailById(this)
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
    
  },
  onGlassClick:function(e){
    // console.log(e.currentTarget.dataset.item)
     wx.navigateTo({
       url: '../glassdetail/index?item=' + JSON.stringify(e.currentTarget.dataset.item)
     })
  }
})

//获取订单详情
function getOrderDetailById(context){
  let url = app.globalData.serverHost + '/storeOrdersController/getordersbyid'
  app.requestPostData(url, {
    "orderid": context.data.orderID
  },
    function (res) {
      if (res.data.success) {
        let list = res.data.obj[0].storeOrdersListList

        context.setData({
          hasList: true,
          orderGlassList: list
        })
      }
    }
  )
}