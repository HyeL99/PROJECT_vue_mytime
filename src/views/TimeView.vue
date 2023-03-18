<template>
<main class="timeView">
  <h2>{{thisDateWithDay}}</h2>
  <span class="bar">
    <img src="@/assets/img/symbol_line.svg" alt="---------------------">
  </span>
  <div class="timerPlace">
    <div class="left">
      <p>{{thisTopic}}</p>
      <button v-if="isTimerOn === false" @click="$startTimer"><img src="@/assets/img/icon_play.svg" alt="재생"></button>
      <button v-else @click="$stopTimer"><img src="@/assets/img/icon_pause.svg" alt="정지"></button>
    </div>
    <div class="right">
      <p>{{timerToString}}</p>
    </div>
  </div>
  <span class="bar">
    <img src="@/assets/img/symbol_line.svg" alt="---------------------">
  </span>
  <div class="topicSelectPlace">
    <select v-model="thisTopic" class="box">
      <option v-for="item in topics">{{item}}</option>
    </select>
    <button @click="$openTopicsPopup"><img src="@/assets/img/icon_setting.svg" alt="설정"></button>
  </div>
  <span class="bar">
    <img src="@/assets/img/symbol_line.svg" alt="---------------------">
  </span>
  <section class="box timesPlace">
    <h2>시간 기록</h2>
    <button class="addBtn" @click="$openTimesPopup">
      <img src="@/assets/img/icon_paint.svg" alt="오늘의 기록 추가">
    </button>
    <ul>
      <template v-for="item in times">
        <li v-if="item.times.length > 0">
          <h3>{{item.topic}} <span>{{item.totalTime}}</span></h3>
          <ul>
            <li v-for="el in item.times">
              <p>시작시간: {{el.startTime}}</p>
              <p>종료시간: {{el.endTime}}</p>
              <button @click="$deleteTimeItem(el.id)"><img src="@/assets/img/icon_plus.svg" alt="삭제"></button>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </section>
  <popup-component :mode="thisMode" @closePopup="$closePopup" v-if="isPopupOpen" :topics="topics"/>
</main>
</template>

<script>
import cmn from "@/js/common";
import {mapMutations, mapState} from "vuex";
import {v4 as uuid} from "uuid";
import PopupComponent from "@/components/PopupComponent.vue";
import {collection, deleteDoc, doc, onSnapshot, query, setDoc} from "firebase/firestore";
import {db} from "@/firebase";

export default {
  name: "TimeView",
  components: {PopupComponent},
  data(){
    return{
      thisDate: null,
      thisDateWithDay: null,
      timer: 0,
      thisTopic: null,
      topics: [],
      isTimerOn: false,
      timerStartTime: null,
      timerEndTime: null,
      times: [],
      isPopupOpen: false,
      thisMode: null,
    }
  },
  computed:{
    ...mapState(['currentUserData']),
    timerToString(){
      return cmn.$secToTime(this.timer)
    },
  },
  watch:{
    isTimerOn(val){
      console.log('실행')
      if(val) this.timerStartTime = new Date();

      const timerSet = val? setInterval(() => {
        if(this.isTimerOn)this.timer++;
        else clearInterval(timerSet);
      }, 1000) : '';

      if(!val){
        this.timerEndTime = new Date();
        this.timer = 0;
        console.log(this.timerStartTime, this.timerEndTime);
        this.$addTimeItem();
      }
    },
  },
  methods:{
    ...mapMutations(['$updateTopicData','$updateTimesData']),
    $startTimer(){
      this.isTimerOn = true;
    },
    $stopTimer(){
      this.isTimerOn = false;
    },
    async $addTimeItem(){
      const timesId = `times@${uuid().replaceAll('-','')}`
      const data = {
        id: timesId,
        date: this.thisDate,
        topic: this.thisTopic,
        startTime: cmn.$getDateAndTimeString(this.timerStartTime),
        endTime: cmn.$getDateAndTimeString(this.timerEndTime)
      }

      try{
        await setDoc(doc(db,`userData/${this.currentUserData.email}/times`,timesId),data)
      }catch(err){console.log(err)}
    },
    $setTimeList(list){
      let timeList = [];
      this.topics.forEach(item => timeList.push({topic: item, times: [], totalTime: 0}));

      list.forEach(item => {
        timeList.find(el => el.topic === item.topic)?.times.push({
          startTime: item.startTime.slice(-8),
          endTime: item.endTime.slice(-8),
          id: item.id,
          totalTime: (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000,
        })
      });

      timeList.forEach(item => {
        item.times.forEach(el => item.totalTime += el.totalTime);
        item.totalTime = cmn.$secToTime(item.totalTime);
        item.times.sort((a,b) => new Date(`${this.thisDate} ${a.startTime}`) - new Date(`${this.thisDate} ${b.startTime}`));
      });

      timeList.sort((a,b) => new Date(`${this.thisDate} ${b.totalTime}`) - new Date(`${this.thisDate} ${a.totalTime}`));

      console.log(timeList)
      this.times = timeList;
    },
    async $deleteTimeItem(id){
      console.log('삭제',id);
      const isDeleteItem = confirm('기록을 삭제하시겠습니까? 삭제한 기록은 복구하실 수 없습니다.')
      if(!isDeleteItem) return;
      try{
        await deleteDoc(doc(db,`userData/${this.currentUserData.email}/times`,id))
      }catch(err){console.log(err)}
    },
    $openTimesPopup(){
      this.thisMode = 'times';
      this.isPopupOpen = true;
    },
    $openTopicsPopup(){
      this.thisMode = 'topics';
      this.isPopupOpen = true;
    },
    $closePopup(){
      this.isPopupOpen = false;
    }
  },
  mounted(){
    this.thisDate = this.$route.params.dayId;
    console.log(this.thisDate);
    this.thisDateWithDay = cmn.$getDateWithDay(this.thisDate);
    this.topics = this.currentUserData?.topics.sort() || [];
    this.thisTopic = this.topics[0];

    let times = this.currentUserData.times.filter(item => item.date === this.thisDate);
    this.$setTimeList(times);

    //토픽 데이터 변경시 데이터 갱신
    const qTopic = query(collection(db, `userData`));
    const unsub1 = onSnapshot(qTopic, (qSnapshot) => {
      let list = [];
      qSnapshot.forEach(doc => list = [...list, doc.data()]);
      let topics = list.find(item => item.email === this.currentUserData.email).topics.sort();
      this.$updateTopicData(topics);
      this.topics = topics || [];

      let time = this.currentUserData.times.filter(item => item.date === this.thisDate);
      this.$setTimeList(time);
    });

    //시간 데이터 변경시 데이터 갱신
    const qTimes= query(collection(db, `userData/${this.currentUserData.email}/times`));
    const unsub2 = onSnapshot(qTimes, (qSnapshot) => {
      let list = [];
      qSnapshot.forEach(doc => list = [...list, doc.data()]);
      console.log(list);

      let times = list.filter(item => item.date === this.thisDate);
      this.$setTimeList(times);

      this.$updateTimesData(list);
    });
  }
}
</script>

<style lang="scss">
.timeView{
  > h2{
    font-size: 1.2rem;
    text-align: center;
  }
  span.bar{
    margin: 0.5rem 0 !important;
  }
  .timerPlace{
    display: flex;
    align-items: center;

    @media (min-width: 400px){
      padding: 0 2rem;
    }

    .left{
      display: flex;
      flex-direction: column;
      width: 100px;
      align-items: center;
      row-gap: 0.5rem;
      flex-shrink: 0;
      p{
        text-align: center;
        font-weight: 700;
      }
      button{
        width: 2rem;
        height: 2rem;
        background: transparent;
        border: 0;
        img{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .right{
      width: 100%;
      text-align: end;
      p{
        font-size: 2rem;
        font-weight: 700;
        padding-right: 25px;
      }
    }
  }
  .topicSelectPlace{
    display: flex;
    align-items: center;
    column-gap: 1rem;
    padding: 0 1rem;
    select{
      -o-appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      /* IE */
      &::-ms-expand {
        display: none;
      }

      flex-grow: 1;
      color: inherit;
      font-family: inherit;
      font-weight: 700;
      text-align: center;
      outline: 0;
      width: 100%;
      line-height: 1.2rem;
    }
    button{
      flex-shrink: 0;
      height: 1.8rem;
      background: transparent;
      border: 0;
      img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .timesPlace{
    >ul{
      >li{
        border-top: 2px double var(--color-text);
        h3{
          line-height: 1.5rem;
          padding: 0.3rem 4rem 0.3rem 1.5rem;
          position: relative;
          &::before{
            content:'';
            position: absolute;
            left: 0;
            top: 0;
            height: 2.1rem;
            width: 1rem;
            background: url("@/assets/img/icon_bullet_symbol.svg") no-repeat center/ contain;
          }
          span{
            font-size: 0.8rem;
            position: absolute;
            right: 0.5rem;
            bottom: 0.5rem;
            font-weight: 300;
          }
        }
        >ul{
          >li{
            position: relative;
            border-top: 1px solid var(--color-text);
            padding: 0.5rem 0;
            &:first-of-type{
              border-top: 2px double var(--color-text);
            }
            p{
              opacity: 0.8;
              font-size: 0.8rem;
              line-height: 1.2rem;
            }
            button{
              position: absolute;
              right: 0.5rem;
              top: 0.5rem;
              width: 1rem;
              height: 1rem;
              background: transparent;
              border: 0;
              transition: all 0.3s ease-out;
              &:hover{
                transform: rotate(180deg);
              }
              img{
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
                transform: rotate(45deg);
              }
            }
          }
        }
      }
    }
  }
}
</style>
