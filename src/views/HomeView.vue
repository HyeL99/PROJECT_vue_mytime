<template>
  <main class="homeView">
    <calendar-component />
    <hr>
    <section v-if="isLogin">
      <article class="box">
        <h2>일정</h2>
        <ul class="bullet">
          <template v-if="plans.length > 0">
            <li v-for="(item) in plans" :key="item">{{item}}</li>
          </template>
          <li v-else>일정 無</li>
        </ul>
      </article>
      <article class="box">
        <h2>Count D-day</h2>
        <ul class="bullet">
          <template v-if="dDay.length > 0">
            <li v-for="item in dDay">
              <span>{{ item.name }}</span>
              <span>{{item.count}}</span>
            </li>
          </template>
          <li v-else>디데이 일정이 없습니다.</li>
        </ul>
      </article>
      <article class="box">
        <h2>오늘 기록</h2>
        <ul class="bullet">
          <template v-if="times.length > 0">
            dd{{ plans}} {{times }}
            <li v-for="item in times">
              <span>{{ item.topic }}</span>
              <span>{{ item.time }}</span>
            </li>
          </template>
          <li v-else>아직 기록이 없습니다</li>
        </ul>
      </article>
    </section>
    <p v-else>서비스 이용을 위해 로그인이 필요합니다.</p>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import CalendarComponent from "@/components/CalendarComponent.vue";
import {mapState} from "vuex";
import cmn from '@/js/common'

export default defineComponent({
  name: 'HomeView',
  components: {CalendarComponent},
  computed:{
    ...mapState(['isLogin','currentUserData']),
  },
  data(){
    return{
      plans:[],
      times:[],
      dDay:[],
    }
  },
  methods:{
    $getTimes(array){
      let times = array;
      let topics = [...new Set(times.map(el => el.topic))];
      let timesList = [];
      topics.forEach(item => {
        timesList.push({topic: item, time: 0});
      });
      times.forEach(el => {
        let startSec = new Date(el.startTime).getTime();
        let endSec = new Date(el.endTime).getTime();
        timesList.forEach(item => {
          if(item.topic === el.topic) item.time += (endSec - startSec);
        })
      })
      timesList.forEach(item => {
        let sec = item.time;
        let hh = Math.floor(sec / (1000*60*60));
        sec -= hh * (1000*60*60);
        let mm = Math.floor(sec / (1000*60))
        sec -= mm * (1000*60);
        let ss = Math.floor(sec / 1000);

        if(hh < 10) hh = '0' + hh;
        if(mm < 10) mm = '0' + mm;
        if(ss < 10) ss = '0' + ss;

        item.time = `${hh}:${mm}:${ss}`;
      });

      return timesList;
    },
    $getDDays(day,array){
      let list = array;
      list.forEach(item => {
        let date = item.date;
        let gap = new Date(day).getTime() - new Date(date).getTime();
        gap = gap / (1000*60*60*24);
        gap = gap < 0 ? Math.ceil(gap) : '+'+Math.floor(gap);
        item.count = 'D'+gap;
        if(item.count === 'D+0') item.count = 'D-day'
      });
      return list;
    }
  },
  mounted(){
    const today = cmn.$getToday();
    if(this.currentUserData){
      this.plans = this.currentUserData.plans.find(item => item.date === today)?.plan || [];
      this.dDay = this.currentUserData.dDay || [];
      // times 가져오기
      let timeList =  this.currentUserData.times.filter(item => item.date === today);
      this.times = this.$getTimes(timeList)
      // dDay 가져오기
      let dDayList = this.currentUserData.dDay;
      this.dDay = cmn.$getDDays(today,dDayList);
    }
  }
});
</script>

<style lang="scss">
.homeView{
  padding: 0 1rem;
}
</style>

