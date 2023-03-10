<template>
<main>
  Todo
</main>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "TodoView",
  computed:{
    ...mapState(['currentUserData'])
  },
  data(){
    return{}
  },
  mounted(){

  }
}
</script>
