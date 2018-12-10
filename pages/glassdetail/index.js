const app = getApp
Page({

  /**
   * 页面的初始数据
   */
  data: {
    glassStr:"",
    cirs:[],
    rects:[],
    glass:{
      widht: 0,
      height: 0
    }
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // cirs: glass.productHoles,
    let glass = JSON.parse(options.item)
    // console.log(glass)
    this.setData({
      glass: {
        width: glass.productLength,
        height: glass.productWidth
      }
    })

    this.setData({
      cirs: JSON.parse(glass.productHoles),
      rects: JSON.parse(glass.productGaps),
      
    })

    // console.log(this.data.rects)

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
})

function converCir(inlist){
  let backList = []
  for(let i in inlist){
    let item = {
      index: -1,
      left: "100",
      right: "",
      top: "0",
      bottom: "",
      width: "100",
      height: "100"
    }
    backList.push(item)
  }
  return backList

}