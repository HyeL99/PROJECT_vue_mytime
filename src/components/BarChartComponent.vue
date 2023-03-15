<template>
<div class="chartWrap">
  <canvas id="barChart"></canvas>
</div>
</template>

<!--<script>-->
<!--import {Chart, registerables} from "chart.js";-->
<!--import {mapState} from "vuex";-->

<!--export default {-->
<!--  name: "BarChartComponent",-->
<!--  props:{-->
<!--    data: Array,-->
<!--    topics: [],-->
<!--    labels: [],-->
<!--  },-->
<!--  computed:{-->
<!--    ...mapState(['currentUserData'])-->
<!--  },-->
<!--  methods:{-->
<!--    getArrayFromProxy(array){-->
<!--      return JSON.parse(JSON.stringify(array));-->
<!--    }-->
<!--  },-->
<!--  created(){-->
<!--    const data = this.getArrayFromProxy(this.data);-->
<!--    const userDataObj = this.getArrayFromProxy(this.currentUserData);-->
<!--    console.log(data, userDataObj);-->
<!--    // console.log(this.currentUserData.topics);-->
<!--    this.topics = userDataObj.topics-->
<!--    this.labels = data.map(item => item.date);-->
<!--    this.labels.forEach(item => item = item.slice(-5))-->
<!--    console.log(this.labels)-->
<!--  },-->
<!--  mounted(){-->
<!--    Chart.register(...registerables)-->
<!--    const el = document.getElementById('barChart').getContext('2d');-->
<!--    const chart = new Chart(el, {-->
<!--      type: 'bar',-->
<!--      data:{-->
<!--        labels: this.labels,-->
<!--        datasets:[{-->
<!--          label: '1번 데이터',-->
<!--          data: [1,2,3],-->
<!--          borderColor: '#7c6e66',-->
<!--          backgroundColor: 'rgba(124, 110, 102, 0.6)',-->
<!--          borderWidth: 2,-->
<!--        }],-->
<!--      }-->
<!--    })-->

<!--  }-->
<!--}-->
<!--</script>-->
