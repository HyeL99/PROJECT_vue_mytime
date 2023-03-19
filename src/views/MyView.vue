<template>
<main class="myView">
  <p><span v-if="currentUserData">{{currentUserData.email}}</span>님, 환영합니다.</p>
  <img src="@/assets/img/symbol_line.svg" alt="-------------------">
  <button @click="$doLogout" class="logoutBtn">로그아웃</button>
  <img src="@/assets/img/symbol_line.svg" alt="-------------------">
  <section class="box" v-if="currentUserData && currentUserData.times.length > 0">
    <h2>통계</h2>
    <div class="chartWrap" style="width: 100%; height: 400px; margin: 0 auto;">
      <canvas id="barChart"></canvas>
    </div>
    <div class="chartWrap" style="max-width: 400px; height: 400px; margin: 0 auto;">
      <canvas id="pieChart"></canvas>
    </div>
  </section>
</main>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import cmn from "@/js/common";
import BarChartComponent from "@/components/BarChartComponent.vue";
import {Chart, registerables} from "chart.js";

export default {
  name: "MyView",
  components: {BarChartComponent},
  computed:{
    ...mapState(['currentUserData']),
  },
  data(){
    return{
      timeList: null,
      barChartProps:{
        labels: [],
        topics: [],
        timeList: [],
      },
      pieChartProps:{
        labels: [],
        dataList: [],
      }
    }
  },
  methods:{
    ...mapMutations(['$logout']),
    $doLogout(){
      this.$logout()
      this.$router.push({name: 'home'});
    },
    $getBarData(){
      const el = document.getElementById('barChart')?.getContext('2d');
      this.barChartProps.labels = this.timeList.map(item => item.date);
      this.barChartProps.topics = this.currentUserData.topics;

      let datasets = [];

      let dataList = [];
      this.barChartProps.labels.forEach(() => {
        dataList.push(0)
      })

      this.barChartProps.topics.forEach((label)=> {
        let obj = {label: label, data: [...dataList]}
        datasets.push(obj);
      });
      datasets.push({
        label: '합계',
        data: [...dataList],
        type: 'line'
      });

      this.timeList.map(dayObj => {
        if(dayObj.time.length>0){
          let dayIndex = this.barChartProps.labels.indexOf(dayObj.date);
          dayObj.time.forEach(timeObj => {
            let index = this.barChartProps.topics.indexOf(timeObj.topic);
            let sec = (new Date(timeObj.endTime).getTime() - new Date(timeObj.startTime).getTime()) / 1000;
            datasets[index].data[dayIndex] += sec;
            datasets[this.barChartProps.topics.length].data[dayIndex] += sec;

          })
        }
      });
      datasets.forEach(item => {
        item.data = item.data.map(el => Math.ceil(el / 60))
      })

      this.barChartProps.labels = this.barChartProps.labels.map(item => item.slice(-5).replace('-','월 ') + '일')
      const barChart = new Chart(el, {
        type: 'bar',
        data:{
          labels: this.barChartProps.labels,
          datasets:datasets
        },
        options:{
          maintainAspectRatio: false,
        }
      })
    },
    $getPieData(){
      const el = document.getElementById('pieChart').getContext('2d');
      this.pieChartProps.labels = this.currentUserData.topics;
      let timeArray = {label: '총 공부 시간',data: []};
      timeArray.data = this.pieChartProps.labels.map(() => 0);
      let list = [];
      this.timeList.forEach(item => {
        item.time.forEach(el => list.push(el))
      })
      list.forEach(item => {
        let index = this.pieChartProps.labels.indexOf(item.topic);
        let sec = (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000;
        timeArray.data[index] += sec;
      })
      timeArray.data = timeArray.data.map(item => Math.round(item / 60));
      // console.log(timeArray,list);
      const pieChart = new Chart(el, {
        type: 'pie',
        data:{
          labels: this.pieChartProps.labels,
          datasets:[
            timeArray
          ]
        },
        options:{
          responsive: true,
        }
      })
    }
  },
  mounted(){
    Chart.register(...registerables);
    let list = [];
    const today = new Date();
    for(let i=6; i>=0; i--){
      list.push({
        date: cmn.$getDayString(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)),
        time: [],
      });
    }
    list.forEach(item => {
      item.time = this.currentUserData.times.filter(el => el.date === item.date);
    });
    this.timeList = list;
    if(this.currentUserData.times.length > 0){
      this.$getBarData();
      this.$getPieData();
    }
  }
}
</script>

<style lang="scss">
.myView{
  p{
    padding-bottom: 1rem;
    span{
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
  img{
    display: block;
    width: 100%;
  }
  button{
    width: 100%;
    padding: 0.3rem 0;
    border: 0;
    background: transparent;
  }
  section{
    margin-top: 1rem;
  }
}
</style>
