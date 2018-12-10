import { VantComponent } from '../../miniprogram_npm/vant-weapp/common/component';
VantComponent({
  classes: ['bar-class', 'price-class', 'button-class'],
  props: {
    tip: [String, Boolean],
    type: Number,
    price: null,
    label: String,
    loading: Boolean,
    disabled: Boolean,
    submitButtonText: String,
    nextButtonText: String,
    currency: {
      type: String,
      value: '¥'
    },
    nextButtonType: {
      type: String,
      value: 'primary'
    },
    submitButtonType: {
      type: String,
      value: 'danger'
    }
  },
  computed: {
    hasPrice: function hasPrice() {
      return typeof this.data.price === 'number';
    },
    priceStr: function priceStr() {
      return (this.data.price / 100).toFixed(2);
    },
    tipStr: function tipStr() {
      var tip = this.data.tip;
      return typeof tip === 'string' ? tip : '';
    }
  },
  methods: {
    onSubmit: function onSubmit(event) {
      this.$emit('submit', event.detail);
    },
    onNext: function onSubmit(event) {
      this.$emit('next', event.detail);
    }
  }
});