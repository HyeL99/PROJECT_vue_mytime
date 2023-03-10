<template>
<div :class="propsType == 'notThis' ? 'notThis datebox' : 'datebox'" @click="$viewDay">
  <div class="top"><span>{{propsDate.slice(-2)}}</span></div>
  <div class="bottom">
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
    ...mapState(['currentUserData'])
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
    }
  },
  mounted(){
    let plans = this.currentUserData?.plans.filter(item => item.date === this.propsDate) || [];
    let record = this.currentUserData?.records.filter(item => item.date === this.propsDate) || [];
    let times = this.currentUserData?.times.filter(item => item.date === this.propsDate) || [];
    this.havePlans = plans.length > 0;
    this.haveRecord = record.length > 0;
    this.haveTimes = times.length > 0;
  }
}
</script>

<style lang="scss">
.notThis{
  opacity: 0.5;
}
.bottom{
  display: flex;
  column-gap: 5px;
  span{
    font-size: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    &.log{
      background-color: crimson;
    }
    &.time{
      background-color: cornflowerblue;
    }
    &.day{
      background-color: mediumseagreen;
    }
  }
}
</style>
