import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Component({
  properties: {
    // myProperty: { // 属性名
    //   type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //   value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    //   observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    // }
   width: {
     type: Number,
      value: "",
      observer: function (newVal, oldVal) {
      }
    }, 
    height: {
      type: Number,
      value: "",
      observer: function (newVal, oldVal) {
      }
    }, 
    backgroundColor: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) {
        this.setData({
            background:newVal
        })
      }
    },galss:{
      type:Object,
      value: { width: 100, height: 100 },
      observer: function(newVal,oldVal){
        this.setData({
          glass: newVal
        })
        recalculationRects(this)
        recalculationCirs(this)
      }
    }, rects: {
      type: Array,
      value: {},
      observer: function (newVal, oldVal) {
        // this.setData({
        //   rects: newVal
        // })
        recalculationRects(this)
      }
    }, cirss: {
      type: Array,
      value: {},
      observer: function (newVal, oldVal) {
        // this.setData({
        //   cirss: newVal
        // })
        recalculationCirs(this)
      }
    },showInList:{
      type:Boolean,
      value:false
    }

    
  },

  data: {
    background: '#eee'
    ,
    paddtop: 25,
    paddleft: 10,
    glass: {width:100,height:100},
    _rects: [], 
    _cirss: [],
    scaling:1,
    panwidth:1,
    currentTranslate:[0,0],
    currentTranslateTemp: [0, 0],
    moveStart: [0, 0],
    outCanvasWidth:100,
    outCanvasHeight:100
  },
  
  
  
  ready: function () {
    this.onRefresh()
  },

  methods: {

    drawOutCanvas: function () {

      var scaling = 1
      var pxnum = this.data.glass.height * this.data.glass.width
      var maxpxnum = 2000000
      if (pxnum > maxpxnum){
        var percent = Math.sqrt(maxpxnum/pxnum)
        scaling = percent
      } else if (pxnum < maxpxnum){
        var percent = Math.sqrt(pxnum / maxpxnum)
        scaling = 1 / percent
      }
      // console.log(scaling)

      
      var ctx = wx.createCanvasContext('canvas2', this)
      // glass: { width: 100, height: 100 },
      var height = this.data.glass.height * scaling + 30
      var width = this.data.glass.width * scaling + 30

      this.setData({
        outCanvasWidth: width,
        outCanvasHeight: height,
      })

     


      ctx.setFillStyle(this.data.background)
      ctx.fillRect(0, 0, this.data.outCanvasWidth, this.data.outCanvasHeight)
      ctx.draw()

      ctx.setLineWidth(this.data.panwidth)
      this.drawGlass(ctx, true, scaling)
      this.drawRects(ctx, scaling)
      this.drawCirs(ctx, scaling)
      this.drawSize(ctx,scaling)

    },

    onRefresh: function (translateX, translateY, scaling) {
      if(translateX == undefined || translateY == undefined){
        this.setData({
          currentTranslate: [0, 0]
        })
      }

      this.ctx = wx.createCanvasContext('canvas', this)
      var canvasWidth = this.properties.width
      var canvasHeight = this.properties.height
      var glassWidth = this.data.galss.width
      var glassHeight = this.data.galss.height

      var s
      if(scaling != undefined){
          s = scaling
      }else if ((glassWidth + this.data.paddleft * 2 + 10 - canvasWidth > 0 || glassHeight + this.data.paddtop + 10  - canvasHeight > 0)) {

        if (glassWidth / canvasWidth > glassHeight / canvasHeight) {
          s = canvasWidth / glassWidth
          s = s - (this.data.paddleft * 2 + 10) / glassWidth

          if ((glassHeight * s + this.data.paddtop + 10) > canvasHeight){
            s = canvasHeight / (glassHeight + 10)
            s = s - (this.data.paddtop + 10) / glassHeight
          }
          
        } else {
          s = canvasHeight / glassHeight 
          s = s - (this.data.paddtop + 10) / glassHeight
          if ((glassWidth * s + this.data.paddleft * 2 + 10) > canvasWidth){
            s = canvasWidth / glassWidth
            s = s - (this.data.paddleft * 2 + 10) / glassWidth
          }
        }

      } else {
        s = 1
      }

      this.setData({
        scaling: s
      })
      
      var ctx = this.ctx
      
      ctx.translate(translateX, translateY)
      ctx.setLineWidth(this.data.panwidth)
      // ctx.fillRect(0, 0, 400, 300)
      
      this.drawGlass(ctx,false,s)
      this.drawRects(ctx,s)
      this.drawCirs(ctx,s)
      this.drawSize(ctx,s)

      // this.ctx.setFillStyle(this.data.background)
      // this.ctx.fillRect(0, 0, 1, 1)
      // ctx.draw(true,function(){
      //   console.log('qq')
      // })

  }
  ,
  drawGlass: function (ctx,isDrawOutCanvas,scaling) {//画玻璃轮廓
    var gwidth = this.data.glass.width * scaling
    var gheight = this.data.glass.height * scaling

    var paddLeft = this.data.paddleft
    var paddTop = this.data.paddtop
    
    function galss() {
      ctx.moveTo(paddLeft, paddTop)
      ctx.lineTo(paddLeft + gwidth, 0 + paddTop)
      ctx.lineTo(paddLeft + gwidth, gheight + paddTop)
      ctx.lineTo(paddLeft, gheight + paddTop)
      ctx.lineTo(paddLeft, paddTop)

      ctx.stroke()
      ctx.draw(isDrawOutCanvas)


      ctx.save()

    }
    galss()

  }
  ,


  
  drawRects: function (ctx, scaling) {//画矩形

    var gs = this.data._rects

    var gwidth = this.data.glass.width * scaling
    var gheight = this.data.glass.height * scaling

    var panwidth = this.data.panwidth
    var background = this.data.background
    var paddLeft = this.data.paddleft
    var paddTop = this.data.paddtop

    function drawRect(left, top, width, height) {

      ctx.setStrokeStyle('black')
      ctx.moveTo(paddLeft + left, paddTop + top)
      ctx.lineTo(paddLeft + left + width, paddTop + top)
      ctx.lineTo(paddLeft + left + width, paddTop + top + height)
      ctx.lineTo(paddLeft + left, paddTop + top + height)
      ctx.lineTo(paddLeft + left, paddTop + top)
      
      ctx.stroke()
      ctx.draw(true)


      if (top == 0) {//上边画白色矩形覆盖
        ctx.setFillStyle(background)
        ctx.fillRect(paddLeft + left, paddTop + top - 1, width, panwidth + 1)
        ctx.draw(true)
      }

      if (left == 0) {//左边画白色矩形覆盖
        ctx.setFillStyle(background)
        ctx.fillRect(paddLeft + left - 1, paddTop + top , panwidth + 1,height)
        ctx.draw(true)
      }

      if (top + height == gheight) {//下边画白色矩形覆盖
        ctx.setFillStyle(background)
        ctx.fillRect(paddLeft + left, paddTop + top +height - 1, width, panwidth + 1)
        ctx.draw(true)
      }

      if (left + width == gwidth) {//右边画白色矩形覆盖
        
        
        ctx.setFillStyle(background)
        ctx.fillRect(paddLeft + left + width - 1, paddTop + top , panwidth + 1,height)
        ctx.draw(true)
      }

      

    }

    for (let i = 0; i < gs.length; i++) {
      let item = gs[i]
      
      drawRect(gs[i].left * scaling, gs[i].top * scaling, gs[i].width * scaling, gs[i].height * scaling)
    }
  }
  ,
  drawCirs: function (ctx, scaling){//画圆
    var cs = this.data._cirss
    var paddLeft = this.data.paddleft
    var paddTop = this.data.paddtop

    function drawcir(left,top,radius){
      
      var cirCenter = [paddLeft + left, paddTop + top]

      ctx.arc(cirCenter[0], cirCenter[1], radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.draw(true) 


    }

    for (let i = 0; i < cs.length; i++) {
      let item = cs[i]
      item.radius = item.dia / 2
      drawcir(cs[i].left * scaling, cs[i].top * scaling, cs[i].radius * scaling)
    }
  }
  ,
  drawSize: function (ctx, scaling){//标尺寸
    ctx.setFillStyle('red')
    ctx.setFontSize(10)

    var g = this.data.galss
    var gwidth = g.width * scaling
    var gheight = g.height * scaling
    var gs = this.data._rects
    var cs = this.data._cirss
    
    var paddLeft = this.data.paddleft
    var paddTop = this.data.paddtop

    function drawArrow(startPoin,endPoin,text){
      drawArrow2(startPoin,endPoin,true,true,text)
    }

    function drawArrow2(startPoin, endPoin, startArrowEnable, endArrowEnable,text) {

      var startpoin = [0, 0]
      var xdiff = startPoin[0] - endPoin[0]
      var ydiff = startPoin[1] - endPoin[1]
      var poinsDistance = Math.abs(Math.sqrt(xdiff * xdiff + ydiff * ydiff))


      var startLine = [startpoin[0], startpoin[1] - 6, startpoin[0], startpoin[1] + 6]//起点线
      var sanjiao = [startpoin[0], startpoin[1], startpoin[0] + 8, startpoin[1] - 4, startpoin[0] + 8, startpoin[1] + 4]
      var endLine = [startpoin[0] + poinsDistance, startpoin[1] - 6, startpoin[0] + poinsDistance, startpoin[1] + 6]//终点线

      var sanjiao2 = [startpoin[0] + poinsDistance, startpoin[1], startpoin[0] + poinsDistance - 8, startpoin[1] - 4, startpoin[0] + poinsDistance - 8, startpoin[1] + 4]
      var dupoin = [endPoin[0] - startPoin[0], endPoin[1] - startPoin[1]]


      ctx.setStrokeStyle('black')
      ctx.translate(startPoin[0], startPoin[1])


      ctx.moveTo(startLine[0], startLine[1])
      ctx.lineTo(startLine[2], startLine[3])
      ctx.moveTo(sanjiao[0], sanjiao[1])
      if (poinsDistance > 30 && startArrowEnable) {
        ctx.lineTo(sanjiao[2], sanjiao[3])
        ctx.moveTo(sanjiao[0], sanjiao[1])
        ctx.lineTo(sanjiao[4], sanjiao[5])
        ctx.moveTo(sanjiao[0], sanjiao[1])
      }

      ctx.lineTo(sanjiao[0] + poinsDistance, sanjiao[1])
      ctx.moveTo(endLine[0], endLine[1])
      ctx.lineTo(endLine[2], endLine[3])
      if (poinsDistance > 30 && endArrowEnable) {
        ctx.moveTo(sanjiao2[0], sanjiao2[1])
        ctx.lineTo(sanjiao2[2], sanjiao2[3])
        ctx.moveTo(sanjiao2[0], sanjiao2[1])
        ctx.lineTo(sanjiao2[4], sanjiao2[5])
      }

      ctx.setTextBaseline('bottom')
      ctx.setTextAlign('center')

      var rotateRadian = Math.PI / 2 - Math.atan2(dupoin[0], dupoin[1])
      ctx.rotate(rotateRadian)
      ctx.fillText(text, sanjiao[0] + poinsDistance / 2, sanjiao[1])

      ctx.stroke()

      ctx.draw(true)
      ctx.rotate(0 - rotateRadian)
      ctx.translate(0 - startPoin[0], 0 - startPoin[1])


    }

    function drawRectArrows(recttop, rectleft, rectwidth, rectheight,rect){
     
      // 在矩形底部画尺寸
      var botomsizepoin = [paddLeft + rectleft, paddTop + recttop + rectheight - 8, paddLeft + rectleft + rectwidth, paddTop + recttop + rectheight - 8]
      drawArrow([botomsizepoin[0], botomsizepoin[1]], [botomsizepoin[2], botomsizepoin[3]], rect.width)  

      // 在矩形左边画尺寸
      var leftsizepoin 
      // if (rect.left == 0) {
      //   leftsizepoin = [paddLeft + rect.left + rect.width + 8, paddTop + rect.top, paddLeft + rect.left + rect.width + 8, paddTop + rect.top + rect.height]
      // } else if (rect.left + rect.width == g.width) {
      //   leftsizepoin = [paddLeft + rect.left - 8, paddTop + rect.top + rect.height, paddLeft + rect.left - 8, paddTop + rect.top]
      // } else {
      //   leftsizepoin = [paddLeft + rect.left + 14, paddTop + rect.top + rect.height, paddLeft + rect.left + 14, paddTop + rect.top]
      // }

      if(rectleft == 0){
        leftsizepoin = [paddLeft + rectleft + rectwidth + 8, paddTop + recttop, paddLeft + rectleft + rectwidth + 8, paddTop + recttop + rectheight]
      }else if(rectleft + rectwidth == gwidth){
        leftsizepoin = [paddLeft + rectleft - 8, paddTop + recttop + rectheight, paddLeft + rectleft - 8, paddTop + recttop]
      }else{
        leftsizepoin = [paddLeft + rectleft + 14, paddTop + recttop + rectheight, paddLeft + rectleft + 14, paddTop + recttop]
      }
      
      drawArrow([leftsizepoin[0], leftsizepoin[1]], [leftsizepoin[2], leftsizepoin[3]], rect.height)

    

      if (recttop == 0 || recttop + rectheight == gheight){
        //靠上下边的不画上下边距
      }else{
        var topsizepoins
          if((recttop + rectheight/2) < gheight/2){//靠上
            topsizepoins = [paddLeft + rectleft + rectwidth / 2, paddTop + recttop, paddLeft + rectleft + rectwidth / 2, paddTop]
            drawArrow([topsizepoins[0], topsizepoins[1]], [topsizepoins[2], topsizepoins[3]], rect.top)
          }else{//靠下
            topsizepoins = [paddLeft + rectleft + rectwidth / 2, paddTop + recttop + rectheight, paddLeft + rectleft + rectwidth / 2, paddTop + gheight] 
          drawArrow([topsizepoins[0], topsizepoins[1]], [topsizepoins[2], topsizepoins[3]], g.height - rect.top - rect.height)
          }
          
      }

      if ( rectleft == 0 || rectleft + rectwidth == gwidth) {
      //靠左右边的缺不画左右边距
      }else{
        var leftsizepoins
        if((rectleft + rectwidth/2) < gwidth/2){//靠左
          leftsizepoins = [paddLeft, paddTop + recttop + rectheight / 2, paddLeft + rectleft, paddTop + recttop + rectheight / 2]
          drawArrow([leftsizepoins[0], leftsizepoins[1]], [leftsizepoins[2], leftsizepoins[3]], rect.left)
        }else{
          leftsizepoins = [paddLeft + rectleft + rectwidth, paddTop + recttop + rectheight / 2, paddLeft + gwidth, paddTop + recttop + rectheight / 2]
          drawArrow([leftsizepoins[0], leftsizepoins[1]], [leftsizepoins[2], leftsizepoins[3]], g.width - rect.left - rect.width)
        }
      }


    }


    function drawCirArrows(cirtop, cirleft,cirradius,cir){

      if(cirtop == 0 || cirtop + cirradius == gheight ){
            //靠上下边不画上下边距
      }else{
         var topsizepoins
         if(cirtop < gheight/2){//靠上
           topsizepoins = [paddLeft + cirleft, paddTop + cirtop, paddLeft + cirleft, paddTop]
           drawArrow2([topsizepoins[0], topsizepoins[1]], [topsizepoins[2], topsizepoins[3]], false,true,cir.top)
         }else{
           topsizepoins = [paddLeft + cirleft, paddTop + cirtop, paddLeft + cirleft, paddTop + gheight]
           drawArrow2([topsizepoins[0], topsizepoins[1]], [topsizepoins[2], topsizepoins[3]], false, true, g.height - cir.top)
         }   
      }



      if (cirleft == 0 || cirleft + cirradius == gwidth) {
        //靠左右边不画左右边距
      } else {
        var leftsizepoins
        if (cirleft < gwidth / 2) {//靠左
          leftsizepoins = [paddLeft, paddTop + cirtop, paddLeft + cirleft, paddTop + cirtop]
          drawArrow2([leftsizepoins[0], leftsizepoins[1]], [leftsizepoins[2], leftsizepoins[3]],true,false, cir.left)
        } else {
          leftsizepoins = [paddLeft + cirleft, paddTop + cirtop, paddLeft + gwidth, paddTop + cirtop]
          drawArrow2([leftsizepoins[0], leftsizepoins[1]], [leftsizepoins[2], leftsizepoins[3]],false,true, g.width -  cir.left)
        }
      }

      ctx.fillText("φ" + cir.dia, paddLeft + cirleft - cirradius - 10, paddTop + cirtop + cirradius+10)
      ctx.stroke()
      ctx.draw(true)


    }
    
   

    
    
    var gwidthpoin = [paddLeft, paddTop - 8, paddLeft + gwidth, paddTop - 8 ]
    drawArrow([gwidthpoin[0], gwidthpoin[1]], [gwidthpoin[2], gwidthpoin[3]],g.width)

    var gheightpoin = [paddLeft + gwidth + 8, paddTop, paddLeft + gwidth + 8, paddTop + gheight]
    drawArrow([gheightpoin[0], gheightpoin[1]], [gheightpoin[2], gheightpoin[3]], g.height)


    for(var i = 0;i< gs.length;i++){
      drawRectArrows(gs[i].top * scaling, gs[i].left * scaling, gs[i].width * scaling, gs[i].height * scaling, gs[i])
    }

    for (var i = 0; i < cs.length; i++) {
      
      drawCirArrows(cs[i].top * scaling, cs[i].left * scaling, cs[i].radius * scaling, cs[i])
    }

  }
  ,
  onCanvasMove: function(e){//画布移动
    var newX = this.data.currentTranslate[0] + (e.changedTouches[0].x - this.data.moveStart[0])
    var newY = this.data.currentTranslate[1] + (e.changedTouches[0].y - this.data.moveStart[1])

    this.setData({
      currentTranslateTemp: [newX, newY]
    })
    this.onRefresh(newX, newY, this.data.scaling)

  }
  ,
  onCanvasMoveEnd:function(){//画布移动结束
    this.setData({
      currentTranslate: [this.data.currentTranslateTemp[0], this.data.currentTranslateTemp[1]]
    })
  }
  ,
  onCanvasMoveStart:function(e){//画布移动开始
    var startX = e.changedTouches[0].x
    var startY = e.changedTouches[0].y
    this.setData({
      moveStart:[startX,startY]
    })
  }
  ,
  zoomUp:function(){//放大
    this.setData({
      scaling: this.data.scaling * 1.1
    })
    this.onRefresh(this.data.currentTranslate[0], this.data.currentTranslate[1], this.data.scaling)
  }
  ,
  zoomDown:function(){//缩小
    this.setData({
      scaling: this.data.scaling / 1.1
    })
    this.onRefresh(this.data.currentTranslate[0],this.data.currentTranslate[1],this.data.scaling)

    // test()
  }
  ,
  
  canvasToFile: function (canvasID) {//画布保存为图片
    wx.canvasToTempFilePath({
      canvasId: canvasID,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res)
          },
          fail: (err) => {
            console.error(err)
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    }, this)
  }
  ,
  saveImg:function(){//保存到相册
    // this.data.glass.width * scaling
    // var gheight = this.data.glass.height * scaling
    if (this.data.glass.width == 0 || this.data.glass.height == 0){
      Toast.fail("长宽不能为0")
      return
    }
    this.drawOutCanvas()
    Toast.loading({
      mask: true,
      message: '正在保存'
    });
    
    var that = this
    setTimeout(function(){
      that.canvasToFile('canvas2')
      setTimeout(function () {
        Toast.success('保存成功')
      },1000)
      
    },2000)
    
    // console.log('保存到相册')
  }
  }

    
  
})

function convertToGrayscale(data) {
  let g = 0
  for (let i = 0; i < data.length; i += 4) {
    g = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11)
    data[i] = g
    data[i + 1] = g
    data[i + 2] = g
  }
  return data
}

function test() {
  console.log(getCurrentPages()[0].data)
}

//重算缺参数
function recalculationRects(context){
  var glass = context.data.glass
  var rects = context.data.rects
  for(var index in rects){
    // console.log(index)
    var item = rects[index]
    if(item.left == ''){
      item.left = glass.width - item.right - item.width
    }
    if (item.top == '') {
      item.top = glass.height - item.bottom - item.height
    }
  }
  context.setData({
    _rects: rects
  })
  // this.setData({
  //   cirss: newVal
  // })
}
//重算孔参数
function recalculationCirs(context){
  var glass = context.data.glass
  var cirs = context.data.cirss
  for (var index in cirs) {
    var item = cirs[index]
    if (item.left == '') {
      item.left = glass.width - item.right
    }
    if (item.top == '') {
      item.top = glass.height - item.bottom
    }
  }
  // console.log(cirs)
  context.setData({
    _cirss: cirs
  })

}
