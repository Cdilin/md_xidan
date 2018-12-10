//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({
  data: {
    glass: {
      width:  0,
      height: 0
    },
     rects: [ ],
     cirs: [ ], 
    deeps: [
      { name: '' }
    ],
    showDeepSheetState:false,
    selectDeep: {name:""},
    showRectEditSheetState:false,
    editingRect:{
      index:-1,
      left: "",
      right: "",
      top: "",
      bottom: "",
      width: "",
      height: ""
    }, 
    showCirEditSheetState: false,
    editingCir: {
      index: -1,
      left: "",
      right: "",
      top: "",
      bottom: "",
      dia: ""
    },
    showParamSheetState:false,
    ganghuaparam:'',
    yanseparam: '',
    ganghuaparamTemp: {name:""},
    yanseparamTemp: '',
    ganghuaarray:[{name:""}],
    yansearray:[{name:""}],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    getTypeList(this)
    getTechList(this)
    getColorList(this)



  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toSubmitPage:function(){
    // wx.navigateTo({
    //   url: '../submit/index'
    // })
    // console.log(this.data.rects)
    var that = this
    submitData(this,function(success){
      if(success){
        that.setData({
          glass: {
            width: 0,
            height: 0
          },
          rects: [],
          cirs: []
        }
        )
        that.glassCanvas.onRefresh()
        wx.switchTab({
          url: '../shopcar/index',
        })
      }
    })
  },
  onNext:function(){
    var that = this
    submitData(this, function (success) {
      if (success) {
        that.setData({
          glass: {
            width: 0,
            height: 0
          },
          rects: [],
          cirs: []
        }
        )
        that.glassCanvas.onRefresh()
        
      }
    })
  }
  ,
  onReady:function(){
    this.glassCanvas = this.selectComponent('#glass_canvas');
    this.setData({
      selectDeep: this.data.deeps[0],
      yanseparam: this.data.yansearray[0],
      ganghuaparam: this.data.ganghuaarray[0]
    })
  },
  onWidthChange:function(w){//长修改回调
    var curH = this.data.glass.height
    var newW = Number(w.detail)
    this.setData({
      glass:{
        width: newW,
        height: curH
      }
    })
    this.glassCanvas.onRefresh()
  }, 
  onHeightChange: function (h) {//宽修改回调
    var curW = this.data.glass.width
    var newH = Number(h.detail)
    this.setData({
      glass: {
        width: curW,
        height: newH
      }
    })
    this.glassCanvas.onRefresh()
  },
  onDeepsSelect: function(v){//厚度选择回调
    this.setData({
      selectDeep: v.detail,
      showDeepSheetState: false
    })
  }, 
  onDeepSheetClose:function(){//厚度选择窗关闭
    this.setData({
      showDeepSheetState: false
    })
  }, 
  showDeepSheet:function(){//打开厚度选择窗
    this.setData({
      showDeepSheetState: true
    })
  }, 
  showRectEditSheet: function () {//打开开缺编辑窗
    this.setData({
      editingRect: {
        index: -1,
        left: "",
        right: "",
        top: "",
        bottom: "",
        width: "",
        height: ""
      },
      showRectEditSheetState: true
    })
  }, 
  onRectEditSheetClose: function () {//关闭开缺编辑窗
    this.setData({
      showRectEditSheetState: false
    })
  }, 

  // 开缺参数监听 onRectTopChange onRectLeftChange onRectWidthChange onRectHeightChange
  onRectTopChange: function (v) {
    var edrect = this.data.editingRect
    // console.log(v.detail)
    if (v.detail.label == '上边距') {
      edrect.top = v.detail.value
      edrect.bottom = ''
    }else{
      // console.log('xbianju')
      edrect.top = ''
      edrect.bottom = v.detail.value
    }
    this.setData({
      editingRect: edrect
    })
  }, 
  onRectLeftChange: function (v) {
    var edrect = this.data.editingRect
    if(v.detail.label == '左边距'){
      edrect.left = v.detail.value
      edrect.right = ''
    }else{
      edrect.left = ''
      edrect.right = v.detail.value
    }
    this.setData({
      editingRect: edrect
    })
  }, 
  onRectWidthChange: function (v) {
    var edrect = this.data.editingRect
    edrect.width = v.detail
    this.setData({
      editingRect: edrect
    })
  }, 
  onRectHeightChange: function (v) {
    var edrect = this.data.editingRect
    edrect.height = v.detail
    this.setData({
      editingRect: edrect
    })
  },
  editRect: function(e){//重新编辑缺
    var editItem = e.currentTarget.dataset.item
    editItem.index = e.currentTarget.dataset.itemindex
    this.setData({
      editingRect: editItem,
      showRectEditSheetState: true
    })
  }
  , 
  removeRect: function (e) {
    var editItem = this.data.editingRect
    var newArry = this.data.rects
    newArry.splice(editItem.index, 1)
    this.setData({
      rects: newArry,
      showRectEditSheetState: false
    })
    this.glassCanvas.onRefresh()
  },
  showCirEditSheet: function () {//打开孔编辑窗
    this.setData({
      editingCir: {
        index: -1,
        left: "",
        right:"",
        top: "",
        bottom:"",
        dia: ""
      },
      showCirEditSheetState: true
    })
  },
  onCirEditSheetClose: function () {//关闭孔编辑窗
    this.setData({
      showCirEditSheetState: false
    })
  },
  onRectEditFinish: function () {//编辑完成
    var rectItem = this.data.editingRect

    let isrect = false
    if (rectItem.top == "0" || rectItem.bottom == "0" ) {
      isrect = true
    } else if(rectItem.left == "0" || rectItem.right == "0") {
      isrect = true
    } 
    // console.log(rectItem)
    // console.log(isrect)
    if(!isrect) {
      Toast.fail("不能在玻璃中间开缺")
      return
    }

    if (rectItem.width != 0 && rectItem.height != 0) {
      var newArray = this.data.rects
      if (rectItem.index == -1) {
        newArray.push(rectItem)
      } else {
        newArray[rectItem.index] = rectItem
      }
      this.setData({
        rects: newArray
        ,
        editingRect: {
          index: -1,
          left: "",
          right: "",
          top: "",
          bottom: "",
          width: "",
          height: ""
        }
      })

      this.setData({
        showRectEditSheetState: false
      })
      this.glassCanvas.onRefresh()
    } else {
    Toast('长宽不能为0');
    }

    //  {
  },
  // 开孔参数监听 onCirTopChange onCirLeftChange onCirRadiusChange
  onCirTopChange: function (v) {
    var edcir = this.data.editingCir
    if(v.detail.label == '上边距'){
      edcir.top = v.detail.value
      edcir.bottom = ''
    }else{
      edcir.top = ''
      edcir.bottom = v.detail.value
    }

    

    this.setData({
      editingCir: edcir
    })
  }, 
  onCirLeftChange: function (v) {
    var edcir = this.data.editingCir
    if (v.detail.label == '左边距') {
      edcir.left = v.detail.value
      edcir.right = ''
    }else{
      edcir.left = ''
      edcir.right = v.detail.value
    }
    this.setData({
      editingCir: edcir
    })
  }, 
  onCirRadiusChange: function (v) {
    var edcir = this.data.editingCir
    edcir.dia = v.detail
    this.setData({
      editingCir: edcir
    })
  }, 
  editCir: function (e) {
    var editItem = e.currentTarget.dataset.item
    editItem.index = e.currentTarget.dataset.itemindex
    this.setData({
      editingCir: editItem,
      showCirEditSheetState: true
    })
  }
  ,
  removeCir: function (e) {
    var editItem = this.data.editingCir
    var newArry = this.data.cirs
    newArry.splice(editItem.index,1)
    this.setData({
      cirs: newArry,
      showCirEditSheetState: false
    })
    this.glassCanvas.onRefresh()
  },
  onCirEditFinish: function () {//编辑完成
    
     var cirItem = this.data.editingCir
     
     if (cirItem.dia != 0) {
        var newArray = this.data.cirs
        if (cirItem.index == -1) {
          newArray.push(cirItem)
        } else {
          newArray[cirItem.index] = cirItem
        }
        
      this.setData({
        cirs: newArray
        ,
        editingCir: {
          index: -1,
          left: "",
          right: "",
          top: "",
          bottom: "",
          dia: ""
          }
      })

      this.setData({
        showCirEditSheetState: false
      })
      this.glassCanvas.onRefresh()
    }else{
       Toast('直径不能为0');
    }
  },
  showParamSheet:function(){//打开参数选择
    if(this.data.ganghuaparam==''){
      this.setData({
        ganghuaparam: this.data.ganghuaarray[0],
        ganghuaparamTemp: this.data.ganghuaarray[0]
      })
    }else{
      this.setData({
        ganghuaparamTemp: this.data.ganghuaparam
      })
    }
    if (this.data.yanseparam == '') {
      this.setData({
        yanseparam: this.data.yansearray[0],
        yanseparamTemp: this.data.yansearray[0]
      })
    }else{
      this.setData({
        yanseparamTemp: this.data.yanseparam
      })
    }
    this.setData({
      showParamSheetState: true
    })
  },
  onParamSheetClose:function(){//关闭参数编辑窗
    this.setData({
      showParamSheetState: false
    })
  },
  ganghuasel:function(e){//钢化选择回调
    this.setData({
      ganghuaparamTemp: e.currentTarget.dataset.buttonvalue
    })
  },
  yansesel:function(e){//颜色选择回调
    this.setData({
       yanseparamTemp: e.currentTarget.dataset.buttonvalue
    })
  },
  paramsel_ok:function(){
    this.setData({
      yanseparam: this.data.yanseparamTemp,
      ganghuaparam: this.data.ganghuaparamTemp,
      showParamSheetState: false
    })
  }


})

//获取产品品种列表
function getTypeList(page){
  let url = app.globalData.serverHost + '/productTypesController/typeslist'
  app.requestPostData(url,{},
    function(res){
      if (res.data.success) {
        page.setData({
          deeps: res.data.obj
        })
      }
    }
  )
}

//获取产品工艺列表
function getTechList(context){
  let  url =  app.globalData.serverHost + '/productTechsController/techslist'
  app.requestPostData(url,{},
    function(res){
      if (res.data.success) {
        context.setData({
          ganghuaarray: res.data.obj
        })
      }
    }
  )
}

//获取颜色列表
function getColorList(context) {

let url = app.globalData.serverHost + '/productColorsController/colorslist'
app.requestPostData(url,{},
  function(res){
    context.setData({
      yansearray: res.data.obj
    })
  }
)
}

//添加到购物车
function submitData(contenxt,callback){
  if (contenxt.data.glass.width == 0 || contenxt.data.glass.height == 0){
    callback(false)
    Toast.fail('长宽不能为0')
    return
  }

  let url = app.globalData.serverHost + '/storeCartController/addcart'
  app.requestPostData(url,
    {
      "productName": contenxt.data.selectDeep.name + contenxt.data.yanseparam.name + contenxt.data.ganghuaparam.name,
      "productLength": contenxt.data.glass.width,
      "productWidth": contenxt.data.glass.height,
      "productHoles": JSON.stringify(contenxt.data.cirs),
      "productGaps": JSON.stringify(contenxt.data.rects),
      "productTypeid": contenxt.data.selectDeep.id,
      "productColorid": contenxt.data.yanseparam.id,
      "productTechid": contenxt.data.ganghuaparam.id,
      "productDeep": contenxt.data.selectDeep.deep,
      "productQty": "1"
    },
    function(res){
      callback(res.data.success)
    }
  )

}



