<template>
  <main class="homeView">
    <calendar-component />
    <hr>
    <section v-if="isLogin">
      <article class="box" @click="$router.push({name: 'day',params:{dayId: today}})">
        <h2>일정</h2>
        <button class="viewMore">+</button>
        <ul class="bullet scheduleItem">
          <template v-if="plans.length > 0">
            <li v-for="(item) in plans" :key="item">{{item}}</li>
          </template>
          <li v-else>일정 無</li>
        </ul>
      </article>
      <article class="box" @click="$router.push({name: 'dDay'})">
        <h2>D-day</h2>
        <button class="viewMore">+</button>
        <ul class="bullet homeDDay">
          <template v-if="dDay.length > 0">
            <li v-for="item in dDay">
              <span>{{ item.name }}</span>
              <span>{{item.count}}</span>
            </li>
          </template>
          <li v-else>디데이 일정이 없습니다.</li>
        </ul>
      </article>
      <article class="box" @click="$router.push({name: 'time',params:{dayId: today}})">
        <h2>오늘 기록</h2>
        <button class="viewMore">+</button>
        <ul class="bullet">
          <template v-if="times.length > 0">
            dd{{ plans}} {{times }}
            <li v-for="item in times">
              <span>{{ item.topic }}</span>
              <span>{{ item.time }}</span>
            </li>
          </template>
          <li v-else>기록 無</li>
        </ul>
      </article>
      <article class="box todoBtn" @click="$router.push({name: 'todo'})">
        <h2>Todo List</h2>
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
  components: { CalendarComponent},
  computed:{
    ...mapState(['isLogin','currentUserData','holidays','lunarDays']),
  },
  data(){
    return{
      plans:[],
      times:[],
      dDay:[],
      today: null,
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
  },
  mounted(){
    // this.today = '2023-01-23'
    this.today = cmn.$getToday();
    if(this.currentUserData){
      let year = this.today.slice(0, 4);
      let month = this.today.slice(5, 7);
      let date =  this.today.slice(8);

      let holiday = this.holidays.find(item => item.month === month && item.day === date);
      let lunarDay = this.lunarDays.find(item => item.year.toString() === year).dayList.find(item => item.month === month && item.day === date);
      let dDayToday = this.currentUserData.dDay.filter(item => item.date === this.today);

      let plans = this.currentUserData.plans.find(item => item.date === this.today)?.plan || [];
      if(!! holiday) plans.push(holiday.name);
      if(!! lunarDay) plans.push(lunarDay.name);
      dDayToday.forEach(item => plans.push(item.name))
      this.plans = plans.sort();

      this.dDay = this.currentUserData.dDay || [];
      // times 가져오기
      let timeList =  this.currentUserData.times.filter(item => item.date === this.today);
      this.times = this.$getTimes(timeList)
      // dDay 가져오기
      let dDayList = this.currentUserData.dDay;
      this.dDay = cmn.$getDDays(this.today,dDayList);

    }
  }
});
</script>

<style lang="scss">
.homeView{
  padding: 0 1rem;
  article{
    margin-top: 0.5rem;
    &.todoBtn{
      padding: 1rem 0.5rem !important;
      text-align: center;
      h2{
        padding-bottom: 0 !important;
      }
    }
    ul.scheduleItem{
      li{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    ul.homeDDay{
      li{
        display: flex;
        column-gap: 1rem;
        span{
          line-height: 1.5;
        }
        span:nth-of-type(1){
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span:nth-of-type(2){
          width: 70px;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>

