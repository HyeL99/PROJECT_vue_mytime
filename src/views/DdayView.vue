<template>
<main class="dDayView">
  <section class="box">
    <h2>D-day</h2>
    <ul class="bullet">
      <li v-if="dDay.length > 0" v-for="(el,index) in dDay" :key="index">
        <div class="left">
          <span>{{ el.date.replaceAll('-','.').slice(-8) }}</span>
          <span>{{ el.name }}</span>
          <span>{{ el.count }}</span>
        </div>
        <button @click="$deleteDDayItem(el.id)">삭제</button>
      </li>
    </ul>
  </section>

  <button @click="this.viewPopup = true" class="addBtn">추가하기</button>
  <popup-component :mode="'dDay'" @closePopup="$closePopup" v-if="viewPopup"/>
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
      viewPopup: false,
    }
  },
  methods:{
    ...mapMutations(['$updateDDayData']),
    async $deleteDDayItem(id){
      console.log(id);
      try{
        await deleteDoc(doc(db, `userData/${this.currentUserData.email}/dDay`,id));
      }catch(err){console.log(err)}
    },
    $closePopup(){
      this.viewPopup = false;
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

<style lang="scss">
.dDayView{
  section{
    li{
      display: flex;
      justify-content: space-between;
      margin: 0.5rem 0;
      .left{
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        column-gap: 0.5rem;
        span{
          line-height: 1.5;
          &:first-of-type{
            width: 70px;
            white-space: nowrap;
            flex-shrink: 0;
          }
          &:nth-last-of-type(2){
            width: 100%;
            flex-grow: 1;
          }
          &:last-of-type{
            width: 50px;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      }
      button{
        flex-shrink: 0;
        background-color: transparent;
        border: 0;
        opacity: 0.7;
        transition: all 0.3s;
        height: 1.5rem;
        &:hover{
          opacity: 1;
          font-weight: 700;
        }
      }
    }
  }
  .addBtn{
    margin-top: 0.5rem;
    background-color: transparent;
    border: 0;
    float: right;
  }
}
</style>
