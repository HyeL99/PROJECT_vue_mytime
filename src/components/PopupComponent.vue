<template>
<div id="popoup">
  <h2>{{mode}}</h2>
  <section v-if="mode === 'dDay'">
    <input type="text" placeholder="제목 입력">
    <hr>
    <VueDatePicker v-model="dDayDate" />
  </section>
</div>
</template>

<script>
import { v4 as uuid} from 'uuid';
import VueDatePicker from "@vuepic/vue-datepicker";
import cmn from "@/js/common";
export default {
  name: "PopupComponent",
  components: {VueDatePicker},
  data(){
    return{
      mode: null,
      dDayDate: null, //Date 객체 형태로 반환
      dDay: null,     //최종날짜
    }
  },
  watch:{
    dDayDate(){
      console.log('dd',this.dDayDate);
      this.dDay = cmn.$getDayString(this.dDayDate);
      console.log(this.dDay)
    }
  },
  mounted(){
    console.log(uuid());
    console.log(this.$route.name);
    this.mode = this.$route.name;
  }
}
</script>
