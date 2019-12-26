<template>
    <transition name="move">
        <div v-show="showFlag" class="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-content">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="price">
                        <span class="now">¥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'food',
        props: {
            food: {
                type: Object
            }
        },
        data() {
          return {
              showFlag: false
          }
        },
        methods: {
            /* 展示页面 */
            show() {
                this.showFlag = true
            },
            hide() {
                this.showFlag = false
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .move-enter-active, .move-leave-active
        transition: all 0.2s linear
        transform translate3d(0, 0, 0) //每个表项相对于当前自身的高度做一个偏移
    .move-enter, .move-leave-to
        transform translate3d(100%, 0, 0)
    .food
        position fixed
        left 0
        top 0
        bottom 48px
        z-index 30
        width 100%
        background-color: #fff
        .image-header
            position relative
            width 100%
            height: 0
            padding-top 100%
            img
                position absolute
                top 0
                left 0
                width 100%
                height: 100%
            .back
                position absolute
                top 10px
                left 0
                .icon-arrow_lift
                    display block
                    padding 10px
                    color white
                    font-size: 20px
</style>
