<template>
<div :class="propsType == 'notThis' ? 'notThis datebox' : 'datebox'" @click="$viewDay">
  <div class="top"><span :class="isHoliday? 'holiday' : ''">{{propsDate.slice(-2)}}</span></div>
  <div class="bottom" v-if="currentUserData">
    <span class="day" v-if="havePlans">일정 있음</span>
    <span class="time" v-if="haveTimes">시간기록 있음</span>
    <span class="log" v-if="haveRecord">하루기록 있음</span>
  </div>
</div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "CalendarDateComponent",
  props: {
    propsDate: String,
    propsType: String
  },
  computed: {
    ...mapState(['currentUserData','holidays','lunarDays'])
  },
  methods: {
    $viewDay(){
      this.$emit('viewDay')
    }
  },
  data(){
    return{
      havePlans: false,
      haveRecord: false,
      haveTimes: false,
      isHoliday: false,
    }
  },
  mounted(){
    let year = this.propsDate.slice(0, 4);
    let month = this.propsDate.slice(5, 7);
    let date =  this.propsDate.slice(8);

    let plans = this.currentUserData?.plans.filter(item => item.date === this.propsDate) || [];
    let record = this.currentUserData?.records.filter(item => item.date === this.propsDate) || [];
    let times = this.currentUserData?.times.filter(item => item.date === this.propsDate) || [];
    let holiday = this.holidays.find(item => item.month === month && item.day === date);
    let lunarDay = this.lunarDays.find(item => item.year.toString() === year)?.dayList.find(item => item.month === month && item.day === date);

    let dDay = this.currentUserData?.dDay.find(item => item.date === this.propsDate);

    if(!! holiday || !!lunarDay) {
      this.isHoliday = true;
    }

    this.havePlans = plans.length > 0 || !! dDay;
    if(!this.havePlans) this.havePlans = this.isHoliday;
    if(!this.havePlans){
      let list = this.currentUserData?.plans.filter(item => item.date.slice(-5) === this.propsDate.slice(-5)) || [];
      for(let item of list){
        for(let el of item.plan){
          if (el.isEveryYear) {
            this.havePlans = true;
            break;
          }
        }
      }
    }
    this.haveRecord = record.length > 0;
    this.haveTimes = times.length > 0;
  }
}
</script>

<style lang="scss">
.datebox{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.notThis > div{
  opacity: 0.5;
}
.top{
  span.holiday{
    color: crimson;
  }
}
.bottom{
  display: flex;
  column-gap: 2px;
  align-items: flex-end;
  span{
    font-size: 0;
    width: 0.8rem;
    height:0.8rem;
    &.log{
      position: absolute;
      right: 2px;
      top:0;
      height: 22px;
      background: url('@/assets/img/icon_bookmark.svg') no-repeat top /contain;
    }
    &.time{
      background: url("@/assets/img/icon_clock.svg") no-repeat center / contain;
    }
    &.day{
      background: url("@/assets/img/icon_calendar.svg") no-repeat center / contain;
    }
  }
}
</style>
