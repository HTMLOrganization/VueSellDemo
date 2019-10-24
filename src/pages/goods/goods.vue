<template>
  <div class="goods">
    <!-- 左边menu菜单 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]">
            </span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 右边food -->
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, index) in item.foods" :key="index" class="border-1px food-item">
              <div class="icon">
                <img width="57px" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <!-- 添加减少组件 -->
                <div class="cartcontrol-wrapper">
                  <cart-control @cart_add="_drop" :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 底部shopCart -->
    <shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import shopcart from '../../components/shopcart/shopcart.vue'
  import cartControl from '../../components/cartControl/cartControl.vue'
  const ERR_OK = 0
  export default {
    name: 'goods',
    components: {
      shopcart,
      cartControl
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    mounted () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      /* 获取数据 */
      this.$http.get('/api/goods').then((response) => {
        if (response.body.errno === ERR_OK) {
          this.goods = response.body.data
          this.$nextTick(() => { // 使用better-scroll 添加滚动效果
            this._initScroll()
            this._calculateHeight() // 计算区间高度
          })
        }
      })
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      /* 选中的商品数组 */
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => { // 获取所有商品列表
          good.foods.forEach((food) => { // 获取所有的食品列表
            if (food.count) { // 如果选中的商品个数不为空,则加入到数组中
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      /* 初始化滚动视图 */
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodScroll = new BScroll(this.$refs.foodWrapper, {
          click: true,
          probeType: 3 // 检测实时滚动的位置
        })

        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)) // 取整绝对值 获取右侧列表滚动的Y值
        })
      },
      /* 计算区间高度 */
      _calculateHeight() {
        /* 获取dom元素 */
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      /* 菜单选择 */
      selectMenu(index, event) {
        if (!event._constructed) { // 拦截浏览器自带的点击事件
          return
        }
        // 自己派发的点击事件
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index] // 获取氧元素
        this.foodScroll.scrollToElement(el, 300) // 滚动到某个元素
      },
      /* 监听+号按钮点击事件 */
      _drop(target) {
        this.$refs.shopcart.drop(target)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table   /* 垂直居中 */
        height 54px
        width: 56px
        line-height: 14px
        padding 0 12px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background #fff
          font-weight bold
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width: 12px
          height: 12px
          margin-right 2px
          -webkit-background-size: 12px 12px
          background-size: 12px 12px
          background-repeat:no-repeat
          &.decrease
            bg-image('../../assets/img/decrease_3')
          &.discount
            bg-image('../../assets/img/discount_3')
          &.guarantee
            bg-image('../../assets/img/guarantee_3')
          &.invoice
            bg-image('../../assets/img/invoice_3')
          &.special
            bg-image('../../assets/img/special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height: 26px
        border-left 2px solid #d9dde1
        font-size: 12px
        color rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          font-size：0
          .name
            margin 2px 0 8px
            height 14px
            line-height: 14px
            font-size: 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height: 12px
          .extra
            display flex
            margin-left -1px
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height: 24px
            .now
              margin-right 8px
              font-size: 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through  /*穿过的横线*/
              font-size: 10px
              color rgb(147, 153, 159)
          .cartcontrol-wrapper
            position absolute
            right  0
            bottom 0

</style>
