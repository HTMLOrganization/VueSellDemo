<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <ul>
        <li class="tab-item"><router-link to="/goods"><i></i>商品</router-link></li>
        <li class="tab-item"><router-link to="/ratings"><i></i>评论</router-link></li>
        <li class="tab-item"><router-link to="/seller"><i></i>商家</router-link></li>
      </ul>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './pages/header/header.vue'
const ERR_OK = 0
export default {
  name: 'App',
  components: {
    'v-header': header
  },
  data() {
    return {
      seller: {}
    }
  },
  created () {
    // 网络请求
    this.$http.get('/api/seller').then((response) => {
      if (response.body.errno === ERR_OK) {
        this.seller = response.body.data
      }
    }, (error) => {
      console.log(error)
    })
  },
  mounted () {
   console.log('创建完App组件')
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  #app
    .tab
      display flex
      width 100%
      height: 40px
      line-height:40px
      ul
        border-1px(rgba(7, 17, 27, 0.1))
        display flex
        width 100%
        height 40px
        line-height 40px
       li
         flex 1
         text-align center
         display: block
         font-size: 14px
         color: rgb(77, 85, 93)
      .tab-item {
        flex: 1;
        text-align: center;

        &>a {
          display: block;
          font-size: 14px;
          color: rgb(77, 85, 93);

          &.active {
            color: rgb(240, 20, 20);
          }
        }
      }
</style>
