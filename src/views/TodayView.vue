<template>
<main>
  <section class="box">
    <h2>일정</h2>
    <ul class="bullet">
      <template v-if="plans && plans.length > 0">
        <li v-for="(item, index) in plans" :key="index">{{item}}</li>
      </template>
      <li v-else>오늘 일정은 없습니다.</li>
    </ul>
  </section>
  <section class="box">
    <h2>시간기록</h2>
    <ul class="bullet">
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
  <section class="box">
    <h2>오늘의 기록</h2>
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
</main>
</template>

<script>
import {mapState} from "vuex";
import cmn from "@/js/common";

export default {
  name: "TodayView",
  computed:{
    ...mapState(['currentUserData'])
  },
  data(){
    return{
      plans: null,
      record:null,
      times: null,
    }
  },
  mounted(){
    let thisDate = this.$route.params.dayId;

    // 오늘 일정 받아오기
    this.plans = this.currentUserData.plans.find(item => item.date === thisDate)?.plan;

    // 시간 기록 받아오기
    let timeList = this.currentUserData.times.filter(el => el.date === thisDate);
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
    this.record = this.currentUserData.records.find(item => item.date === thisDate);
  }
}
</script>

<style>
.box .wrap img{
  width: 100%;
}

</style>
