<!--
 * @Author      : Mr.bin
 * @Date        : 2023-06-20 17:09:12
 * @LastEditTime: 2023-06-20 17:09:21
 * @Description : 刷新中转页
-->
<template>
  <div class="refresh" v-loading.fullscreen.lock="fullscreenLoading"></div>
</template>

<script>
export default {
  name: 'refresh',

  data() {
    return {
      fullscreenLoading: true, // 加载动画

      /* 路由传参 */
      routerName: JSON.parse(this.$route.query.routerName),
      duration: JSON.parse(
        this.$route.query.duration ? this.$route.query.duration : 800
      ) // 刷新时长
    }
  },

  created() {
    setTimeout(() => {
      this.$router.push({
        path: this.routerName
      })
    }, this.duration)
  }
}
</script>

<style lang="scss" scoped>
.refresh {
  width: 100%;
  height: 100%;
}
</style>
