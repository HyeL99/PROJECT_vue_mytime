<template>
<div id="popoup">
  <h2>{{mode}}</h2>
  <section v-if="mode === 'dDay'">
    <input type="text" placeholder="제목 입력" v-model="dDayProps.title">
    <hr>
    <VueDatePicker v-model="dDayDate" />
    <button @click="$addDDayItem">등록</button><button @click="$clearForm">취소</button>
  </section>
</div>
</template>

<script>
import { v4 as uuid} from 'uuid';
import VueDatePicker from "@vuepic/vue-datepicker";
import cmn from "@/js/common";
import {mapActions, mapState} from "vuex";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/firebase";
export default {
  name: "PopupComponent",
  components: {VueDatePicker},
  data(){
    return{
      mode: null,
      dDayDate: null, //Date 객체 형태로 반환
      dDayProps:{
        title: null,
        date: null,
      },
    }
  },
  computed:{
    ...mapState(['currentUserData'])
  },
  watch:{
    dDayDate(){
      if(!!this.dDayDate) this.dDayProps.date = cmn.$getDayString(this.dDayDate);
    }
  },
  methods:{
    async $addDDayItem(){
      if(this.dDayProps.title === null || this.dDayProps.title === '') alert('제목을 입력해주세요!');
      else if(this.dDayProps.date === null || this.dDayProps.date === '') alert('날짜를 선택해주세요!!');
      else {
        let dDayId = `dDay@${uuid().replaceAll('-','')}`;
        let data = {
          id: dDayId,
          name: this.dDayProps.title,
          date: this.dDayProps.date,
        };
        console.log(data)
        try{
          await setDoc(doc(db,`userData/${this.currentUserData.email}/dDay`,data.id),data)
        }catch(err){console.log(err)}

        this.$clearForm()
      }
    },
    $clearForm(){
      this.dDayDate = null;
      this.dDayProps = {title: null, date: null,};
    }
  },
  mounted(){
    console.log(uuid());
    console.log(this.$route.name);
    this.mode = this.$route.name;
  }
}
</script>
