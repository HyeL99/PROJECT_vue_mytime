<template>
  <header-component />
  <router-view :key="$route.fullPath" v-if="! store.state.isLoading"></router-view>
  <div v-else>로딩중</div>
  <footer-component />
</template>
<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import store from "@/store";
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1;
}
h1,h2,h3,h4,h5,h6 {
  font-size: 100%;
}
button{
  font-size: 100%;
  cursor: pointer;
}
a{
  color: inherit;
  text-decoration: none;
}
html, body, #app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
ol,ul{
  list-style: none;
}
/*------------------ reset -------------*/
#app{
  display: flex;
  flex-direction: column;
  main{
    flex-grow: 1;
  }
}
</style>
