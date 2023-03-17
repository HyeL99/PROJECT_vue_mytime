<template>
<main class="todayView">
  <div class="nav">
    <button @click="$router.push({name: 'day',params:{dayId: prevDate}})">{{prevDateWithDay}}</button>
    <p> {{thisDateWithDay}}</p>
    <button @click="$router.push({name: 'day',params:{dayId: nextDate}})">{{nextDateWithDay}}</button>
  </div>
  <section class="box">
    <h2>일정</h2>
    <button class="addBtn" @click="$openSchedulePopup">
      <img src="@/assets/img/icon_paint.svg" alt="일정 추가">
    </button>
    <ul class="bullet schedule">
      <li v-for="(item, index) in thisHolidays" :key="index">
        <span class="holiday">{{item.name}}</span>
      </li>
      <template v-if="plans && plans.length > 0">
        <li v-for="(item, index) in plans" :key="index">
          <span>{{item.name}}</span>
          <button v-if="!item.isDDay" @click="$deleteScheduleItem(item.name)">삭제</button>
          <button v-if="item.isDDay" @click="$router.push({name: 'dDay'})">D-day</button>
        </li>
      </template>
      <li v-else-if="thisHolidays === null && plans === null">오늘 일정은 없습니다.</li>
    </ul>
  </section>
  <section class="box" @click="$router.push({name: 'time',params:{dayId: thisDate}})">
    <h2>시간기록</h2>
    <button class="viewMore">+</button>
    <ul class="bullet timesItem">
      <template v-if="times && times.length > 0">
        <li v-for="(item, index) in times" :key="index">
          <span>{{item.topic}}</span>
          <span>{{item.totalTime}}</span>
        </li>
      </template>
      <li v-else>
        아직 기록이 없습니다.
      </li>
    </ul>
  </section>
  <span class="bar">
    <img src="@/assets/img/symbol_line.svg" alt="--------------------------  ">
  </span>
  <section class="box">
    <h2>오늘의 기록</h2>
    <button class="addBtn" @click="$openRecordPopup">
      <img src="@/assets/img/icon_paint.svg" alt="오늘의 기록 추가">
    </button>
    <div class="wrap" v-if="!!record">
      <template v-if="!!record.img">
        <img :src="record.img" alt="일기 이미지" class="box">
      </template>
      <p v-else>이미지X</p>
      <p>{{record.story}}</p>
    </div>
    <ul v-else class="bullet">
      <li>오늘 기록이 없습니다.</li>
    </ul>
  </section>
  <popup-component :mode="popupMode" v-if="isPopupOpen" @closePopup="$closePopup"/>
</main>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import cmn from "@/js/common";
import PopupComponent from "@/components/PopupComponent.vue";
import {collection, deleteDoc, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {db} from "@/firebase";

export default {
  name: "TodayView",
  components: {PopupComponent},
  computed:{
    ...mapState(['currentUserData','holidays','lunarDays']),
    thisDateWithDay(){
      if(!this.thisDate) return '';
      let dateArray = this.thisDate.split('-');
      let day = this.$getDay(this.thisDate);
      return `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}(${day})`
    },
    prevDateWithDay(){
      return this.prevDate?.replaceAll('-','.');
    },
    nextDateWithDay(){
      return this.nextDate?.replaceAll('-','.');
    }
  },
  data(){
    return{
      plans: null,
      record:null,
      times: null,
      thisHolidays: null,
      prevDate: null,
      thisDate: null,
      nextDate: null,
      isPopupOpen: false,
      popupMode: null,
    }
  },
  methods:{
    ...mapMutations(['$updatePlanData']),
    $getDay(val){
      let dayList = ['일','월','화','수','목','금','토'];
      return dayList[new Date(val).getDay()];
    },
    $openSchedulePopup(){
      this.isPopupOpen = true;
      this.popupMode = 'schedule';
    },
    $openRecordPopup(){
      this.isPopupOpen = true;
      this.popupMode = 'record';
    },
    $closePopup(){
      this.isPopupOpen = false;
    },
    async $deleteScheduleItem(name){
      let planData = this.currentUserData.plans.find(item => item.date === this.thisDate)
      console.log(name, planData);

      if(planData.plan.length === 1){
        try{
          await deleteDoc(doc(db,`userData/${this.currentUserData.email}/plans`,this.thisDate))
        }catch(err){console.log(err)}
      } else {
        let dataList = planData.plan.filter(item => item !== name);
        planData.plan = dataList;
        try{
          await setDoc(doc(db,`userData/${this.currentUserData.email}/plans`,this.thisDate),planData)
        }catch(err){console.log(err)}
      }

    }
  },
  mounted(){
    this.thisDate = this.$route.params.dayId;

    // 이전 날짜와 다음날 날짜 불러오기
    let date_thisDate = new Date(this.thisDate)
    this.prevDate = cmn.$getDayString(new Date(date_thisDate.getFullYear(), date_thisDate.getMonth(), date_thisDate.getDate() - 1))
    this.nextDate = cmn.$getDayString(new Date(date_thisDate.getFullYear(), date_thisDate.getMonth(), date_thisDate.getDate() + 1))

    // 오늘 일정 받아오기
    let planList = this.currentUserData.plans.find(item => item.date === this.thisDate)?.plan;
    let dDayList = this.currentUserData.dDay.filter(item => item.date === this.thisDate);
    let plans = [];

    let year = this.thisDate.slice(0, 4);
    let month = this.thisDate.slice(5, 7);
    let date =  this.thisDate.slice(8);
    let holiday = this.holidays.find(item => item.month === month && item.day === date);
    let lunarDays = this.lunarDays.find(item => item.year.toString() === year)?.dayList.filter(item => item.month === month && item.day === date);
    let thisHolidays = !!holiday ? [holiday] : [];
    lunarDays.forEach(item => thisHolidays.push(item))
    this.thisHolidays = thisHolidays.length > 0 ? thisHolidays : null;

    planList?.sort();
    dDayList?.sort((a,b) => a.name - b.name);

    planList?.forEach(item => plans.push({name: item, isDDay: false}));
    dDayList?.forEach(item => plans.push({name: item.name, isDDay: true}));
    this.plans = plans.length > 0 ? plans : null;

    // 시간 기록 받아오기
    let timeList = this.currentUserData.times.filter(el => el.date === this.thisDate);
    let timeArray = this.currentUserData.topics.map(item => {return {topic: item, time: []}});
    timeList.map(item => timeArray.find(el => el.topic === item.topic).time.push(item))
    timeArray.map(item => {
      let total = 0;
      item.time.forEach(el => total += (new Date(el.endTime).getTime() - new Date(el.startTime).getTime()));
      item.totalSec = total / 1000;
      item.totalTime = cmn.$secToTime(total / 1000)
    })

    this.times = timeArray.filter(item => item.totalSec > 0) || [];
    // 오늘의 기록(일기) 받아오기
    this.record = this.currentUserData.records.find(item => item.date === this.thisDate);

    //일정 데이터 변경시 데이터 갱신
    const qSchedule = query(collection(db, `userData/${this.currentUserData.email}/plans`));
    const unsub = onSnapshot(qSchedule, (qSnapshot) => {
      let list = [];
      qSnapshot.forEach(doc => list = [...list, doc.data()]);
      this.$updatePlanData(list);
      let plans = [];
      planList = list.find(item => item.date === this.thisDate)?.plan;

      planList?.sort();
      dDayList?.sort((a,b) => a.name - b.name);

      planList?.forEach(item => plans.push({name: item, isDDay: false}));
      dDayList?.forEach(item => plans.push({name: item.name, isDDay: true}));
      this.plans = plans.length > 0 ? plans : null;
    });
  }
}
</script>

<style lang="scss">
.todayView {
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 0.5rem;

    button {
      font-size: 0.8rem;
      background: transparent;
      border: 0;
    }

    p {
      flex-grow: 1;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 700;
    }
  }

  section {
    margin: 0.5rem 0;
  }

  .box .wrap img {
    width: 100%;
  }

  .schedule {
    li {
      display: flex;
      margin: 0.5rem 0;
      span {
        flex-grow: 1;
        line-height: 1.5rem;
        &.holiday{
          color: crimson;
        }
      }
      button{
        width: 50px;
        flex-shrink: 0;
        background-color: transparent;
        border: 0;
        height: 1.5rem;
        opacity: 0.7;
        transition: all 0.2s ease-out;
        &:hover {
          opacity: 1;
          font-weight: 700;
        }
      }
    }
  }
  .timesItem{
    li{
      margin: 0.5rem 0;
    }
  }
}

</style>
