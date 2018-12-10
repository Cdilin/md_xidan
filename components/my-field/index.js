import { VantComponent } from '../../miniprogram_npm/vant-weapp/common/component';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
VantComponent({
  field: true,
  classes: ['input-class'],
  props: {
    icon: String,
    label: String,
    labelIndex:{
      type:String,
      observer:function(newVal,oldVal){
        // console.log('labelIndex=' + this.data.labelIndex)
        var newLabel = this.data.labels.length > newVal ? this.data.labels[newVal] :''
        var newValue = this.data.values.length > newVal ? this.data.values[newVal] :''
        this.setData({
          label: newLabel,
          value: newValue
        })
      }
    },
    labels: { 
    type:Array,
    observer: function (newVal,oldVal){
      // console.log(newVal)
      if(newVal.length != 0){
        var showRadioIcon = newVal.length > 1
        this.setData({
          radio: newVal,
          label: newVal[this.data.labelIndex],
          showRadioIcon: showRadioIcon
        })
      }
      
    }
    }
    ,
    values:{
      type:Array,
      observer: function (newVal, oldVal) { 
        this.setData({
          value:newVal[this.data.labelIndex]
        })
      } 
        
      }
    ,
    error: Boolean,
    focus: Boolean,
    center: Boolean,
    isLink: Boolean,
    leftIcon: String,
    disabled: Boolean,
    autosize: Boolean,
    readonly: Boolean,
    required: Boolean,
    iconClass: String,
    clearable: Boolean,
    inputAlign: String,
    customClass: String,
    confirmType: String,
    errorMessage: String,
    placeholder: String,
    customStyle: String,
    useIconSlot: Boolean,
    useButtonSlot: Boolean,
    placeholderStyle: String,
    cursorSpacing: {
      type: Number,
      value: 50
    },
    maxlength: {
      type: Number,
      value: -1
    },
    type: {
      type: String,
      value: 'text'
    },
    border: {
      type: Boolean,
      value: true
    },
    titleWidth: {
      type: String,
      value: '90px'
    }
  },
  data: {
    showClear: false,
    showLableSheet: false,
    radio:[],
    showRadioIcon:false

  },
  
  mounted: function(){
  },
  
  computed: {
    inputClass: function inputClass() {
      var data = this.data;
      return this.classNames('input-class', 'van-field__input', {
        'van-field--error': data.error,
        'van-field__textarea': data.type === 'textarea',
        'van-field__input--disabled': data.disabled,
        ["van-field__input--" + data.inputAlign]: data.inputAlign
      });
    }
  },
  beforeCreate: function beforeCreate() {
    this.focused = false;
  },
  methods: {
    onInput: function onInput(event) {
      var _ref = event.detail || {},
          _ref$value = _ref.value,
          value = _ref$value === void 0 ? '' : _ref$value;

      this.$emit('input', value);
      // this.$emit('change', value);
      var label = this.data.label
      this.$emit('change', { value, label});
      this.setData({
        value: value,
        showClear: this.getShowClear(value)
      });
    },
    onFocus: function onFocus() {
      this.$emit('focus');
      this.focused = true;
      this.setData({
        showClear: this.getShowClear()
      });
    },
    onBlur: function onBlur() {
      this.focused = false;
      this.$emit('blur');
      this.setData({
        showClear: this.getShowClear()
      });
    },
    onClickIcon: function onClickIcon() {
      this.$emit('click-icon');
    },
    getShowClear: function getShowClear(value) {
      value = value === undefined ? this.data.value : value;
      return this.data.clearable && this.focused && value && !this.data.readonly;
    },
    onClear: function onClear() {
      this.setData({
        value: '',
        showClear: this.getShowClear('')
      });
      this.$emit('input', '');
      var label = this.data.label
      this.$emit('change', { value:'', label});
    },
    onConfirm: function onConfirm() {
      this.$emit('confirm', this.data.value);
    }
    ,
    onLableClick: function onLableClick(){
      // console.log("123456")
      this.setData({ showLableSheet: true })

      // Dialog.alert({
      //   title: '标题',
      //   message: '弹窗内容'
      // }).then(() => {
      //   // on close
      // });
    }
    ,
    onLableSheetClose: function onLableSheetClose (){
      this.setData({ showLableSheet: false})
      
    }
    ,
    onRadioSheetClick: function onRadioSheetClick(e){
      var index = e.currentTarget.dataset.index
      var newLabel = e.currentTarget.dataset.name
      var newValue = this.data.values[index]
      this.setData({
        labelIndex: index,
        label: newLabel,
        value: newValue,
        showLableSheet: false,
      })
      
      // console.log({ 'value': newValue, 'label': newLabel })
      if(newValue != ''){
        this.$emit('change', { 'value': newValue, 'label': newLabel });

      }
    }
    

  }
});