const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

// import area from '../../assets/area'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    custName:"",
    custPhone:"",
    custAddr:"",
    orderList:[]
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
    // console.log(area)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getShopCarList(this)
    
    // this.setData({
    //   hasList: true,        // 既然有数据了，那设为true吧
    //   carts: [
    //     { id: 1, title: '新鲜芹菜 半斤', image: '/image/s5.png', num: 4, price: 0.01, selected: true },
    //     { id: 2, title: '素米 500g', image: '/image/s6.png', num: 1, price: 0.03, selected: true }
    //   ]
    // });
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
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                   // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;     // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }
  ,
  selectList(e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    this.setData({
      carts: carts
    });
    this.getTotalPrice();                           // 重新获取总价
  }
  ,
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();                               // 重新获取总价
  }
  ,
  // 增加数量
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  // 减少数量
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  }
  ,
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let item = carts[index]
    let that = this
    removeShopCarByid(this,item.id,index,function(success,index){
      if(success){
        carts.splice(index, 1);              // 删除购物车列表里这个商品
        that.setData({
          carts: carts
        });
        if (!carts.length) {                  // 如果购物车为空
          that.setData({
            hasList: false              // 修改标识为false，显示购物车为空页面
          });
        } else {                              // 如果不为空
          that.getTotalPrice();           // 重新计算总价格
        }
      }
    })
    
  }
  ,
  showAddressEditSheet(){
    let tempList = []
    for (let i in this.data.carts) {
      let item = this.data.carts[i]
      if (item.selected) {
        tempList.push(item)
      }
    }
    this.setData({
      orderList: tempList
    })
    if (this.data.orderList.length == 0) {
      return
    }
    this.setData({
      addressEditSheet:true
    })
  },
  onAddressEditSheetClose(){
    this.setData({
      addressEditSheet: false
    })
  },
  onOrderAddressChange(e){
    // console.log(e)
    this.setData({
      custAddr: e.detail
    })
  },
  onOrderNameChange(e) {
    // console.log(e)
    this.setData({
      custName: e.detail
    })
  },
  onOrderPhoneChange(e) {
    // console.log(e)
    this.setData({
      custPhone: e.detail
    })
  },
  toSavedOrder(){//保存为订单
    // wx.switchTab({
    //   url: '../orderlist/index',
    // })
    

    submitOrder(this,function(success){
      wx.switchTab({
        url: '../orderlist/index',
      })
      // getShopCarList(this)
    })
  }

})

//获取购物车列表
function getShopCarList(context) {
  let url = app.globalData.serverHost + '/storeCartController/storeCartList'
  app.requestPostData(url,{},
    function(res){
      if (res.data.success) {
        let list = res.data.obj
        for (let i in list) {
          list[i].selected = true
        }
        context.setData({
          hasList: true,
          carts: list
        })
      }
    }
  )
}

//移除购物车
function removeShopCarByid(context,id,index,callback) {
  let url = app.globalData.serverHost + '/storeCartController/deleteStoreCart'
  app.requestPostData(url, 
    {
      'id': id
    },
    function(res){
      // console.log(res)
      callback(res.data.success, index)
    }
  )
}

//保存为订单
function submitOrder(context, callback) {
  if (context.data.custName == ''){
    Toast.fail('请输入客户名称')
    return
  }
  if (context.data.custPhone == '') {
    Toast.fail('请输入联系电话')
    return
  }
  if (context.data.custAddr == '') {
    Toast.fail('请输入地址')
    return
  }

  let url = app.globalData.serverHost + '/storeOrdersController/addorders'
  let data = {
    "custName": context.data.custName,
    "custPhone": context.data.custPhone,
    "custAddr": context.data.custAddr,
    "ttlQty": context.data.orderList.length,
    "list": context.data.orderList
    }
  // console.log(data)
  // console.log(orderList)
  app.requestPostData(url,
    data,
    function(res){
      // console.log(res)
      callback(res.data.success)
    }
  )
}
