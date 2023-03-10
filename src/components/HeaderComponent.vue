<template>
<header>
  <h1 @click="$router.push({name: 'home'})">My Times</h1>
  <button @click="$router.push({name: 'login'})" v-if="!isLogin">login</button>
  <button @click="$router.push({name: 'myAccount'})" v-else>My</button>
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
  padding: 0.5rem;
  position: relative;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  button{
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
