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
input{
  outline: 0;
  color: inherit;
  font-family: 'GowunDodum-Regular';
}
/*------------------ reset -------------*/
*{
  word-break: keep-all;
}
#app{
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  main{
    flex-grow: 1;
    padding: 1rem;
    overflow-y: scroll;
    background-color: var(--color-main);
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    //스크롤 삭제 설정
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
  .box{
    position: relative;
    border: 1px solid var(--color-text);
    padding: 0.5rem;
    h2{
      font-size: 1.2rem;
      padding-bottom: 0.5rem;
    }
    button.viewMore{
      position: absolute;
      right: 0rem;
      top: 0rem;
      padding: 0.5rem;
      background: transparent;
      border: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }
    button.addBtn{
      position: absolute;
      right: 0rem;
      top: 0rem;
      padding: 0.5rem;
      background: transparent;
      border: 0;
      font-size: 0;
    }
  }
  span.bar{
    display: block;
    margin: 1rem 0;
    img{
      width: 100%;
    }
  }
  ul.bullet{
    li{
      line-height: 1.5rem;
      padding-left: 1rem;
      position: relative;
      &::before{
        content:'';
        position: absolute;
        left: 0;
        top: 0;
        height: 1.5rem;
        width: 10px;
        background: url("@/assets/img/icon_bullet_symbol.svg") no-repeat center/ contain;
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
