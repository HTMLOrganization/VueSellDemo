<template>
  <div class="headerVue">
    <div class="content-wrapper">
      <div class="avatar">
        <img width='64' height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <!--动态更换图片-->
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!-- 公告 -->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 背景图 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <!-- 弹框详情 -->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="closeDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from '../../components/star/star.vue'
export default {
  name: 'headerVue',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star
  },
  data() {
    return {
      /* 是否显示弹出框 */
      detailShow: false
    }
  },
  methods: {
    showDetail() {
      this.detailShow = true
    },
    closeDetail() {
      this.detailShow = false
    }
  },
  mounted () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .headerVue
    position relative
    color: #fff
    overflow hidden
    background : rgba(7,17,27,0.4)
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size: 0;
      .avatar
        display: inline-block
        vertical-align top
        img
          border-radius 3px
      .content
        display inline-block
        margin-left 16px
        font-size: 14px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align text-top  // 垂直对齐
            width 30px
            height: 18px
            bg-image('../../assets/img/brand')
            -webkit-background-size: 30px 18px
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left 6px
            font-size: 16px;
            line-height: 18px;
            font-weight bold
        .description
          margin-bottom 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display inline-block
            vertical-align top
            width: 12px
            height: 12px
            margin-right 4px
            -webkit-background-size: 12px 12px
            background-size: 12px 12px
            background-repeat:no-repeat
            &.decrease
              bg-image('../../assets/img/decrease_1')
            &.discount
              bg-image('../../assets/img/discount_1')
            &.guarantee
              bg-image('../../assets/img/guarantee_1')
            &.invoice
              bg-image('../../assets/img/invoice_1')
            &.special
              bg-image('../../assets/img/special_1')
          .text
            vertical-align top
            line-height: 12px;
            font-size 10px
            height 12px
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height: 24px
        border-radius 14px
        background: rgba(0, 0, 0, 0.2)
        text-align center
        .count
          font-size: 10px;
          vertical-align top
        .icon-keyboard_arrow_right
          margin-left 2px
          font-size: 10px;
          line-height: 24px;
    .bulletin-wrapper
      position relative
      height 28px
      line-height: 28px
      padding 0 22px 0 12px
      white-space nowrap    // 文字不换行
      overflow hidden
      text-overflow ellipsis // 显示...
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height: 12px
        bg-image('../../assets/img/bulletin')
        -webkit-background-size: 22px 12px
        background-size: 22px 12px
        background-repeat: no-repeat;
      .bulletin-text
        vertical-align top
        font-size: 12px
        margin 0 4px
      .icon-keyboard_arrow_right
        position absolute
        font-size: 10px;
        right 12px
        top: 8px
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      /* 模糊背景 */
      filter: blur(10px)
    .detail
      /* 渐入渐出动画 */
      &.fade-enter, &.fade-leave-to
        opacity 0
      &.fade-enter-active, &.fade-leave-active
        transition opacity 0.5s
      position fixed
      z-index 100
      top 0
      left 0
      width: 100%
      height: 100%
      overflow auto
      background: rgba(7, 17, 27, 0.8)
      /* 模糊效果 */
      backdrop-filter blur(10px)
      .detail-wrapper
        min-height 100%
        width: 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            line-height: 16px
            text-align center
            font-size: 16px
            font-weight: bold
          .star-wrapper
            margin-top 18px
            padding 2px 0
            text-align center
          .title
            display flex
            margin 28px auto 24px auto
            width 80%
            .line
              flex 1
              align-self center
              border-bottom 1px solid rgba(255, 255, 255, 0.6)
            .text
              padding 0 12px
              font-size: 14px
              font-weight bold
          .supports
            width 80%
            margin 0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size: 0
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                width: 16px
                height: 16px
                vertical-align top
                margin-right 6px
                -webkit-background-size: 16px 16px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('../../assets/img/decrease_2')
                &.discount
                  bg-image('../../assets/img/discount_2')
                &.guarantee
                  bg-image('../../assets/img/guarantee_2')
                &.invoice
                  bg-image('../../assets/img/invoice_2')
                &.special
                  bg-image('../../assets/img/special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        clear both
        font-size 32px
</style>
