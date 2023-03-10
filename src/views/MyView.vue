<template>
<main>
  <button @click="$doLogout">로그아웃</button>
</main>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "MyView",
  methods:{
    ...mapMutations(['$logout']),
    $doLogout(){
      this.$logout()
      this.$router.push({name: 'home'});
    }
  }
}
</script>

<style scoped>

</style>
