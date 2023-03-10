<template>
<main>
  <ul>
    <li v-if="dDay.length > 0" v-for="(el,index) in dDay" :key="index">
      <span>{{ el.name }}</span>
      <span>{{ el.count }}</span>
      <button @click="$deleteDDayItem(el.id)">삭제</button>
    </li>
  </ul>
  <button>추가하기</button>
  <popup-component />
</main>
</template>

<script>
import cmn from "@/js/common";
import {mapState} from "vuex";
import PopupComponent from "@/components/PopupComponent.vue";

export default {
  name: "DdayView",
  components: {PopupComponent},
  computed:{
    ...mapState(['currentUserData']),
  },
  data(){
    return{
      dDay: [],
    }
  },
  methods:{
    $deleteDDayItem(id){
      console.log(id);
    }
  },
  mounted(){
    let today = cmn.$getToday();
    let dDayList = this.currentUserData.dDay;
    this.dDay = cmn.$getDDays(today,dDayList);
    console.log(this.dDay);
  }
}
</script>
