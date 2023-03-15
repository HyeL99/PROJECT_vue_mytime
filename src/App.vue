<template>
  <header-component />
  <router-view :key="$route.fullPath" v-if="! store.state.isLoading"></router-view>
  <main v-else>로딩중</main>
  <footer-component />
</template>
<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import store from "@/store";
</script>

<style lang="scss">
@font-face {
  font-family: 'GowunDodum-Regular';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunDodum-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

:root{
  --color-main: #FFFFFF;
  --color-text: #14274E;
  --color-text-opa-70: rgba(20,39,78,0.7);
}
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
  font-family: inherit;
}
a{
  color: inherit;
  text-decoration: none;
}
html, body, #app{
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'GowunDodum-Regular';
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
    padding: 1rem;
    overflow-y: scroll;
    background-color: var(--color-main);
  }
  .box{
    border: 1px solid var(--color-text);
    padding: 0.5rem;
    h2{
      font-size: 1.2rem;
      padding-bottom: 0.5rem;
    }
  }
  ul.bullet{
    li{
      line-height: 1.2;
      padding-left: 1rem;
      position: relative;
      &::before{
        content:'';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 10px;
        background: url("@/assets/img/icon_bullet_symbol.svg") no-repeat center / contain;
      }
    }
  }
}
</style>

<!--
  ## 아이콘 출처
  # 부채
  <div> 아이콘 제작자 <a href="https://www.flaticon.com/kr/authors/freepik" title="Freepik"> Freepik </a> from <a href="https://www.flaticon.com/kr/" title="Flaticon">www.flaticon.com'</a></div>
-->
