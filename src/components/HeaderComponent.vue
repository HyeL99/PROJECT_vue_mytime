<template>
<header>
  <h1 @click="$router.push({name: 'home'})">
    <img src="@/assets/img/icon_fan_r.svg">
    <span>나의 시간</span>
    <img src="@/assets/img/icon_fan_l.svg">
  </h1>
  <button @click="$router.push({name: 'login'})" v-if="!isLogin" class="loginBtn">
    <img src='@/assets/img/icon_login.svg' alt="">
    <span>로그인</span>
  </button>
  <button @click="$router.push({name: 'myAccount'})" v-else class="myBtn">
    <span>내 정보</span>
  </button>
</header>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "HeaderComponent",
  computed:{
    ...mapState(['isLogin'])
  }
}
</script>

<style lang="scss">
header{
  padding: 10px 0.5rem;
  position: relative;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  background-color: var(--color-text);
  color: var(--color-main);
  h1{
    font-size: 20px;
    img{
      height: 30px;
      vertical-align: top;
    }
    span{
      line-height: 30px;
      padding: 0 0.5rem;
    }
  }
  button{
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: 0;
    color: var(--color-main);
    width: 97.2px;
    height: 36px;
    z-index: 1;
    img{
      position: absolute;
      left: 0px;
      top: 0;
      height: 100%;
    }
    &.myBtn{
      background: url('@/assets/img/icon_symbol_mypage.svg') no-repeat center / contain;
    }
    &.loginBtn{
      margin-right: 10px;
      top: 100%;
      img{
        position: absolute;
        left: 0px;
        top: 0;
        height: 100%;
      }
      span{
        position: relative;
        display: inline-block;
        width: 100%;
        z-index: 2;
        font-weight: 700;
      }
    }
  }
}
</style>
