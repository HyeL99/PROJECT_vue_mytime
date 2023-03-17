<template>
<footer>
<!--  <button @click="$router.push({name: 'day',params:{dayId: today}})">오늘의 일정</button>-->
<!--  <button @click="$router.push({name: 'dDay'})">D-day</button>-->
<!--  <button @click="$router.push({name: 'time',params:{dayId: today}})">타임테이블</button>-->
<!--  <button @click="$router.push({name: 'todo'})">Todo-List</button> -->
  <button @click="$router.push({name: 'home'})">대문 화면</button>
</footer>
</template>

<script>
import cmn from "@/js/common";
export default {
  name: "FooterComponent",
  data(){
    return{
      today: null,
    }
  },
  mounted(){
    this.today = cmn.$getToday()
  }
}
</script>

<style lang="scss">
//footer{
//  box-shadow: 0 0 5px rgba(0,0,0,0.2);
//  display: table;
//  table-layout: fixed;
//  background: var(--color-text);
//  height: 50px;
//  button{
//    display: table-cell;
//    width: 25%;
//    height: 100%;
//    border: 0;
//    background: transparent;
//    color: var(--color-main);
//  }
//}
footer{
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  background: var(--color-text);
  height: 50px;
  text-align: center;
  button{
    width: 25%;
    height: 100%;
    border: 0;
    background: url('@/assets/img/icon_tr_symbol.svg') no-repeat center / contain;
    font-size: 0;
  }
}
</style>
