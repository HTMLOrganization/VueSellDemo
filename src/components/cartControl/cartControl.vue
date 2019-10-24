<template>
  <div class="cartControl">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click="decreaseCart">
        <transition name="inner">
          <span class="inner icon-remove_circle_outline"></span>
        </transition>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
  export default {
    name: 'cartControl',
    props: {
      food: {}
    },
    mounted () {
    },
    methods: {
      /* 添加商品 */
      addCart(event) {
        if (!event._constructed) { // 解决PC端点击触发两次的问题
          return
        }
        if (!this.food.count) {
          /* vue触发set方法,DOM发生变化 */
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        /* 添加一个事件 */
        this.$emit('cart_add', event.target)
      },
      /* 减去商品 */
      decreaseCart(event) {
        if (!event._constructed) { // 解决PC端点击触发两次的问题
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartControl
    font-size: 0
    .cart-add
      display inline-block
      padding 6px /* 为了让点击区域变大 */
      font-size: 24px;
      line-height: 24px
      color rgb(0, 160, 220)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height: 24px
      text-align center
      font-size: 10px;
      color rgb(147, 153, 159)
    /* 减号按钮动画 */
    .cart-decrease {
      display: inline-block;
      padding: 6px;
      .inner {
        display: inline-block;
        font-size: 24px;
        line-height: 24px;
        color: rgb(0,160,220);
      }
      /* 外层的平移动画 */
      &.move-enter-active, &.move-leave-active {
        transition: all 0.5s linear;
        opacity: 1;
        transform: translate3d(0,0,0);
        /* 内层的小球滚动动画 */
        .inner{
          transition: all 0.5s;
          opacity: 1;
          transform: rotate(0deg);
        }
      }
      &.move-enter, &.move-leave-to {
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner{
          opacity: 0;
          transform: rotate(180deg);
        }
      }
    }
</style>
