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
import {mapMutations, mapState} from "vuex";
import PopupComponent from "@/components/PopupComponent.vue";
import {collection, doc, onSnapshot, query, deleteDoc} from "firebase/firestore";
import {db} from "@/firebase";

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
    ...mapMutations(['$updateDDayData']),
    async $deleteDDayItem(id){
      console.log(id);
      try{
        await deleteDoc(doc(db, `userData/${this.currentUserData.email}/dDay`,id));
      }catch(err){console.log(err)}

    }
  },
  mounted(){
    let today = cmn.$getToday();
    let dDayList = this.currentUserData.dDay;
    this.dDay = cmn.$getDDays(today,dDayList);

    const qDDay = query(collection(db, `userData/${this.currentUserData.email}/dDay`));
    const unsub = onSnapshot(qDDay, (qSnapshot) => {
      let list = [];
      qSnapshot.forEach(doc => list = [...list, doc.data()]);

      this.dDay = cmn.$getDDays(today,list);
      this.dDay.sort((a,b) => new Date(a.date) - new Date(b.date))
      this.$updateDDayData(list);
    })

  }
}
</script>
