<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="togglrList">
        <!-- 左边内容 -->
        <div class="content-left">
          <!-- 图标 -->
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalCount>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- 右边内容 结算布局-->
        <div class="content-right">
          <div class="pay" :class="payClass" @click="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!-- 加入购物车 小球跳入动画 -->
      <!-- 小球用的 transition标签包住的，在上面写上vue的javascript动画生命钩子-->
      <!-- v-on:before-enter="beforeEnter" （动画进入前）-->
      <!--  v-on:enter="enter"（动画进入时）-->
      <!-- v-on:after-enter="afterEnter" （动画进入完后）-->
      <div class="ball-container">
        <transition v-on:after-enter="afterEnter" v-on:enter="enter" v-on:before-enter="beforeEnter" name="drop"
                    v-for="(litterBall,indexBall) in balls" :key="indexBall">
          <div v-show="litterBall.show" class="ball">
            <div class="inner" :class="indexBall">
            </div>
          </div>
        </transition>
      </div>
      <!-- 购物车列表弹出框 -->
      <transition name="fade">
        <!-- 购物车列表弹出的样式 -->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.id">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--listShow表示当list详情列表显示的时候mask才显示-->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script>
  import Velocity from 'velocity-animate'
  import cartControl from '../cartControl/cartControl'
  import BScroll from 'better-scroll'

  export default {
    name: 'shopcart',
    components: {cartControl},
    data () {
      return {
        balls: [
          {show: false, index: 0},
          {show: false, index: 1},
          {show: false, index: 2},
          {show: false, index: 3},
          {show: false, index: 4},
          {show: false, index: 5},
          {show: false, index: 6},
          {show: false, index: 7},
          {show: false, index: 8},
          {show: false, index: 9},
          {show: false, index: 10},
          {show: false, index: 11}
        ],
        dropBall: [], // 已经在下降的小球存在这里
        fold: true // 是否是折叠状态
      }
    },
    props: {
      selectFoods: {
        type: Array
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    watch: {
      totalCount (newVal) {
        if (newVal === 0) {
          this.fold = true // 隐藏购物车列表
        }
      }
    },
    computed: {
      /* 选择的总价格 */
      totalPrice () {
        let total = 0
        if (!this.selectFoods) {
          return total
        }
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      /* 选择的总个数 */
      totalCount () {
        let count = 0
        if (!this.selectFoods) {
          return count
        }
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      /* 结算详情 */
      payDesc () {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送` /* ES6语法 拼接字符串 */
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差¥${diff}元起送` /* ES6语法 拼接字符串 */
        } else {
          return '去结算'
        }
      },
      /* 判断class类型 */
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      /* 购物车弹出框列表是否折叠 */
      listShow: {
        get: function () {
          return !this.fold
        },
        set: function () {
          if (!this.totalCount) {
            this.fold = true
            return false
          }
          let show = !this.fold
          if (show) {
            this.$nextTick(() => {
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.listContent, {
                  click: true
                })
              } else {
                this.scroll.refresh()
              }
            })
          }
          return show
        }
      }
    },
    methods: {
      beforeEnter (els) {
        let count = this.dropBall.length - 1 // 获取要下降中的小球个数
        let ball = this.dropBall[count] // 获取最新点击成show:true的小球
        let rect = ball.el.getBoundingClientRect() // getBoundingClientRect()可以获取到元素对象和窗口的相对上下左右的距离
        var rect2 = els.getBoundingClientRect()
        let x = rect.left - 18 // 点击元素的左边距离 - 下面购物车左边的距离，就是小球要运动的X轴距离
        let y = -(window.innerHeight - rect.top - 32) // 窗口的高度 - 点击元素离窗口的高度 - 购物车底部的padding,margin高度，就是小球要运动的y轴距离，且是向下运动，所以是负值
        // els.style.display ="";
        els.style.opacity = 1
        els.style.webkitTransform = `translate3d(0,${y}px,0)`
        els.style.transform = `translate3d(0,${y}px,0)` // 外层做纵轴运动

        // 内层做横轴运动
        let inner = els.getElementsByClassName('inner')[0]
        inner.style.webkitTransform = `translate3d(${x}px,0,0)`
        inner.style.transform = `translate3d(${x}px,0,0)`
      },
      enter (els, done) {
        var _this = this
        let hh = els.offsetHeight // 手动获取这个值，触发浏览器重绘
        _this.$nextTick(function () {
          // 内层做横轴运动
          els.style.opacity = '0'
          let inner = els.getElementsByClassName('inner')[0]
          Velocity(els, {translate3d: 'translate3d(0,0,0)'}, {duration: 600}) // 这里引入了第三方动画插件，需要先 npm i velocity-animate --save ，和 引入 import Velocity from 'velocity-animate'
          Velocity(inner, {translate3d: 'translate3d(0,0,0)'}, {
            duration: 600,
            complete: function () {
              done()
            }
          })
        })
      },
      afterEnter (els) {
        let ball = this.dropBall.shift()
        if (ball) {
          ball.show = false
          els.style.display = 'none' // 这个很重要
        }
      },
      drop (el) { // 小球动画方法,el就是加号按钮元素
        for (let i = 0; i < this.balls.length; i++) {
          if (!this.balls[i].show) { // 把小球show为false的变成true，展示出来
            let ball = this.balls[i]
            ball.show = true // 这里这样写他继承的this.balls的值也会变成true
            ball.el = el // 把这个球的位置保留下来
            this.dropBall.push(ball) // 把这个已经drop的球放到dropBall中
            // console.log(this.dropBall,222)
            return // 结束循环和函数，不会让循环再往后执行了
          }
        }
      },
      /* 点击事件弹出购物列表 */
      togglrList () {
        if (!this.totalCount) { // 购物车没有商品的时候不可点击
          return
        }
        this.fold = !this.fold // 当前是收起状态就展开，展开状态就收起
        this.listShow = false
      },
      /* 隐藏购物车列表 */
      hideList() {
        // this.listShow = true
        this.fold = true // 隐藏购物车列表
      },
      /* 清空购物数组 */
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
        // this.listShow = true
        this.fold = true // 隐藏购物车列表
      },
      /* 点击去结算 */
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`支付￥${this.totalPrice}元`)
        // window.alert('支付' + this.totalPrice + '元');
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height: 48px

    .content
      display flex
      background: #141d27
      color rgba(255, 255, 255, 0.4)

      .content-left
        flex 1
        font-size: 0

        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height: 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background: #141d27

          .logo
            width: 100%
            height: 100%
            border-radius 50%
            background: #2b343c
            text-align center

            &.highlight
              background: rgb(0, 160, 220)

            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color #80858a

              &.highlight
                color #fff

          .num
            position absolute
            top 0
            right 0
            width 24px
            height: 16px
            line-height: 16px
            text-align center
            border-radius 16px
            font-size: 9px
            font-weight: 700
            color #fff
            background-color: rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)

        .price
          display inline-block
          vertical-align top
          line-height: 24px
          margin-top 12px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          color rgba(255, 255, 255, 0.4)
          font-weight: 700

          &.highlight
            color #fff

        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height: 24px
          font-size: 10px
          color rgba(255, 255, 255, 0.4)

      .content-right
        flex 0 0 105px
        width: 105px

        .pay
          height: 48px
          line-height: 48px
          text-align center
          font-size: 12px;
          font-weight 700
          background: #2b333b

          &.not-enough
            background: #2b333b

          &.enough
            background: #00b43c
            color #fff

    .ball-container // 小球飞入动画

      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transform translate3d(0, 0, 0)
        transition all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41) //这个很重要，要变成曲线就需要这个贝赛尔曲线

        .inner
          width 16px
          height 16px
          border-radius 100%
          background rgb(0, 160, 220)
          transition all 0.6s linear
          transform translate3d(0, 0, 0)

    /* 弹出框列表 */
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0) //整个列表相对于当前自身的高度做一个偏移
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s linear
        transform translate3d(0, -100%, 0) //每个表项相对于当前自身的高度做一个偏移
      &.fade-enter, &.fade-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height: 40px
        padding 0 18px
        background: #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size: 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size: 11px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  /* 背景遮罩 */
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40 //z-index要小于shopcart的index
    backdrop-filter blur(10px)
    -webkit-backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity 1
      transition: all 0.5s //设置缓动效果
      background rgba(7, 17, 27, 0.6)
    &.fade-enter, &.fade-leave-active
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
