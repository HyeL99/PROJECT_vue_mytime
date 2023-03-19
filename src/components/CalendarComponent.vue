<template>
<div id="calendarWrap" :key="currentUserData?.email || 'calender'">
  <div class="top">
    <select v-model="yearOp" class="yearBox">
      <option :value="1979 + i" v-for="i of 50" :key="`year_${i}`">{{1979 + i}}</option>
    </select>
    <span class="yearBox">. </span>
    <select v-model="monthOp" class="monthBox">
      <option :value="i" v-for="i of 12" :key="`month_${i}`">{{i}}</option>
    </select>
    <span class="monthBox">月</span>
  </div>
  <div class="calendar">
    <div class="calHead">
      <span v-for="(day,index) in dayList" :key="index" class="tableHeader">{{day}}</span>
    </div>
    <div class="calBody">
      <calendar-date-component :propsDate="prev" :propsType="'notThis'"
                               v-for="(prev,index) in prevDates" :key="prev" @viewDay="$viewDay(prev)"
      />
      <calendar-date-component :propsDate="thisDate" :propsType="'this'"
                               v-for="(thisDate,index) in thisDates" :key="thisDate" @viewDay="$viewDay(thisDate)" :class="thisDate == $today() ? 'today' : ''"
      />
      <calendar-date-component :propsDate="next" :propsType="'notThis'"
                               v-for="(next,index) in nextDates" :key="next" @viewDay="$viewDay(next)"
      />
    </div>
  </div>
</div>
</template>

<script>
import CalendarDateComponent from "@/components/CalendarDateComponent.vue";
import cmn from '@/js/common'
import { mapState } from "vuex";

export default {
  name: "CalendarComponent",
  components: {CalendarDateComponent},
  data(){
    return{
      yearOp: null,
      monthOp: null,
      prevDates: [],
      thisDates: [],
      nextDates: [],
      // dayList: ['일','월','화','수','목','금','토'],
      dayList: ['日','月','火','水','木','金','土']
    }
  },
  computed:{
    ...mapState(["currentUserData"])
  },
  methods:{
    $getCalendar(){
      const viewYear = this.yearOp;
      const viewMonth = this.monthOp;

      //지난달 마지막 날짜와 요일, 이번달 마지막 날짜와 요일 불러오기
      const prevLast = new Date(viewYear, viewMonth - 1, 0);
      const thisLast = new Date(viewYear, viewMonth, 0);

      const PLDate = prevLast.getDate();
      const PLDay = prevLast.getDay();

      const TLDate = thisLast.getDate();
      const TLDay = thisLast.getDay();

      //전체 달력에 필요한 날짜 불러오기
      //Dates 기본 배열들
      const prevDates = [];
      const thisDates = [...Array(TLDate + 1).keys()].slice(1);
      const nextDates = [];

      //prevDates 계산
      if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
          prevDates.unshift(PLDate - i);
        }
      }

      //newDates계산
      for (let i = 1; i <= 42-(prevDates.length + thisDates.length); i++) {
        nextDates.push(i);
      }

      // 구한 배열 기반으로 현재 페이지의 날짜 리스트 받아오기
      let prevList = [];
      let py = prevLast.getFullYear();
      let pm = prevLast.getMonth() + 1;
      pm = pm < 10 ? '0' + pm : pm;
      prevDates.forEach(date => {
        let pd = date < 10 ? '0' + date : date;
        prevList.push(`${py}-${pm}-${pd}`)
      })

      let thisList = [];
      let ty = thisLast.getFullYear();
      let tm = thisLast.getMonth() + 1;
      tm = tm < 10 ? '0' + tm : tm;
      thisDates.forEach(date => {
        let td = date < 10 ? '0' + date : date;
        thisList.push(`${ty}-${tm}-${td}`)
      })

      let nextList = [];
      const nextLast = new Date(viewYear, viewMonth + 1, 0);
      let ny = nextLast.getFullYear();
      let nm = nextLast.getMonth() + 1;
      nm = nm < 10 ? '0' + nm : nm;
      nextDates.forEach(date => {
        let nd = date < 10 ? '0' + date : date;
        nextList.push(`${ny}-${nm}-${nd}`)
      })

      this.prevDates = prevList;
      this.thisDates = thisList;
      this.nextDates = nextList;
    },
    $viewDay(date){
      this.$router.push({name: 'day', params: {dayId: date}})
    },
    $today(){
      return cmn.$getToday();
    }
  },
  created(){
    this.yearOp = new Date().getFullYear();
    this.monthOp = new Date().getMonth() + 1;
    this.$getCalendar()
  },
  watch: {
    yearOp(){
      this.$getCalendar();
    },
    monthOp(){
      this.$getCalendar();
    }
  }
}
</script>

<style lang="scss">
#calendarWrap{
  > .top{
    text-align: center;
    padding-bottom: 0.5rem;
    select {
      -o-appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      /* IE */
      &::-ms-expand {
        display: none;
      }
      font-family: inherit;
      border: 0;
      text-align: center;
      color: var(--color-text);
      outline: 0;
      //font-weight: 700;
      font-size: 1.5rem;
      padding: 0 0.2rem;
    }
  }

}
.calendar{
  .calHead{
    display: flex;
    flex-wrap: wrap;
    .tableHeader{
      width: calc(100% / 7);
      text-align: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #666;
    }
  }
  .calBody{
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem 0;
    .datebox{
      width: calc(100% / 7);
      padding: 0.5rem;
      border-right: 1px solid var(--color-text);
      border-bottom: 1px solid var(--color-text);
      height: 60px;
      .top span{
        display: inline-block;
        width: 1rem;
        height: 1rem;
      }
      &.today .top{
        position: relative;
        &::before{
          content:"";
          position: absolute;
          width: 1.4rem;
          height: 1.4rem;
          left:-0.2rem;
          top:-0.2rem;
          border-radius: 50%;
          background-color: var(--color-text);
        }
        span{
          font-weight: 700;
          position: relative;
          z-index: 1;
          color: var(--color-main);
        }
      }
      &:nth-of-type(-n+7){
        border-top: 1px solid var(--color-text);
      }
      &:nth-of-type(7n+1){
        color: crimson;
        border-left: 1px solid var(--color-text);
      }
      &:nth-of-type(7n+7){
        color: cornflowerblue;
      }
    }
  }
}
</style>
