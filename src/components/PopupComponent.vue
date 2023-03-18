<template>
<div id="popup">
  <div class="contentsWrap box">
    <div class="contents">
      <h2>{{title}}</h2>
      <section v-if="mode === 'dDay'">
        <input type="text" placeholder="제목 입력" v-model="dDayProps.title" class="title">
        <VueDatePicker v-model="dDayDate" class="datepicker" placeholder="d-day  날짜 선택"/>
      </section>
      <section v-if="mode === 'schedule'">
        <input type="text" placeholder="제목 입력" v-model="scheduleProps.title" class="title">
        <VueDatePicker v-model="scheduleDate" class="datepicker" placeholder="d-day  날짜 선택" />
      </section>
      <section v-if="mode === 'record'" class="recordPopup">
        <form action="">
          <div id="fileBox">
            <input class="uploadName" placeholder="이미지 선택(최대 1개)" disabled="disabled">
            <label for="diaryFile">첨부</label>
            <input type="file" id="diaryFile" accept="image/*" autocomplete="off">
          </div>
          <div id="imgViewer">
            <img id="preview" alt="No Image">
          </div>
          <hr>
          <textarea id="diaryContent" placeholder="내용 입력" autocomplete="off"></textarea>
        </form>
      </section>
      <section v-if="mode === 'topics'" class="editTopic">
        <form @submit="$addTopic">
          <input type="text" placeholder="제목입력" v-model="inputTopic">
          <input type="submit" value="추가" class="btnSetting">
        </form>
        <ul class="bullet">
          <li v-for="(item, index) in topics">
            <span>{{item}}</span>
            <button class="btnSetting" @click="$deleteTopic(item)">삭제</button>
          </li>
        </ul>
        <p>기록 주제를 삭제해도 관련 기록이 남아있습니다.</p>
        <p>관련 기록은 동일 주제를 재등록하면 확인 가능합니다.</p>
        <p>기록 주제는 최대 10개까지 설정할 수 있습니다.</p>
      </section>
      <section v-if="mode === 'times'" class="timesPopup">
        <select v-model="timesProps.topic" class="box">
          <option disabled :value="null">기록 주제 선택</option>
          <option v-for="item in topics">{{item}}</option>
        </select>
        <span class="bar">
          <img src="@/assets/img/symbol_line.svg" alt="--------------">
        </span>
        <div class="timePickerPlace">
          <VueDatePicker v-model="selectedStartTime" class="datepicker" placeholder="시작 시간 선택" time-picker/>
          <VueDatePicker v-model="selectedEndTime" class="datepicker" placeholder="종료 시간 선택" time-picker/>
        </div>
      </section>
    </div>
    <div class="buttonPlace">
      <button @click="$addDDayItem" class="box" v-if="mode === 'dDay'">등록</button>
      <button @click="$addScheduleItem" class="box" v-if="mode === 'schedule'">등록</button>
      <button @click="$addRecordItem" class="box" v-if="mode === 'record'">등록</button>
      <button @click="$addTimesItem" class="box" v-if="mode === 'times'">등록</button>
      <button @click="$cancel" class="box" v-if="mode !== 'topics'">취소</button>
      <button @click="$cancel" class="box" v-if="mode === 'topics'">확인</button>
    </div>
  </div>
</div>
</template>

<script>
import { v4 as uuid} from 'uuid';
import VueDatePicker from "@vuepic/vue-datepicker";
import cmn from "@/js/common";
import {mapActions, mapState} from "vuex";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/firebase";
export default {
  name: "PopupComponent",
  components: {VueDatePicker},
  props:{
    mode: String,
    topics: Array,
  },
  data(){
    return{
      title: null,
      dDayDate: null, //Date 객체 형태로 반환
      dDayProps:{
        title: null,
        date: null,
      },
      scheduleDate: null,
      scheduleProps:{
        title: null,
        date: null,
      },
      inputTopic: null,
      timesProps:{
        topic: null,
        startTime: null,
        endTime: null,
      },
      selectedStartTime: null,
      selectedEndTime: null,
    }
  },
  computed:{
    ...mapState(['currentUserData'])
  },
  watch:{
    dDayDate(){
      if(!!this.dDayDate) this.dDayProps.date = cmn.$getDayString(this.dDayDate);
    },
    scheduleDate(){
      if(!!this.scheduleDate) this.scheduleProps.date = cmn.$getDayString(this.scheduleDate);
    },
    selectedStartTime(val){
      if(val === null) return;
      this.timesProps.startTime = this.$setTimeString(val);
    },
    selectedEndTime(val){
      if(val === null) return;
      this.timesProps.endTime = this.$setTimeString(val);
    },
  },
  methods:{
    $setTimeString(val){
      let thisDate = this.$route.params.dayId;
      let hh = val.hours;
      let mm = val.minutes;
      let ss = val.seconds;

      if(hh < 10) hh = '0' + hh;
      if(mm < 10) mm = '0' + mm;
      if(ss < 10) ss = '0' + ss;

      return `${thisDate} ${hh}:${mm}:${ss}`
    },
    async $addDDayItem(){
      if(this.dDayProps.title === null || this.dDayProps.title === '') alert('제목을 입력해주세요!');
      else if(this.dDayProps.date === null || this.dDayProps.date === '') alert('날짜를 선택해주세요!!');
      else {
        let dDayId = `dDay@${uuid().replaceAll('-','')}`;
        let data = {
          id: dDayId,
          name: this.dDayProps.title,
          date: this.dDayProps.date,
        };
        console.log(data)
        try{
          await setDoc(doc(db,`userData/${this.currentUserData.email}/dDay`,data.id),data)
        }catch(err){console.log(err)}

        this.$clearForm();
        this.$emit('closePopup');
      }
    },
    async $addScheduleItem(){
      if(this.scheduleProps.title === null || this.scheduleProps.title === '') alert('제목을 입력해주세요!');
      else if(this.scheduleProps.date === null || this.scheduleProps.date === '') alert('날짜를 선택해주세요!!');
      else {
        let scheduleId = this.scheduleProps.date;
        let plans = this.currentUserData.plans.find(item => item.date === scheduleId)?.plan || [];

        if(plans.includes(this.scheduleProps.title)) return alert('이미 등록된 일정입니다.')

        plans.push(this.scheduleProps.title)
        let data = {
          date: this.scheduleProps.date,
          plan: plans
        };
        try{
          await setDoc(doc(db,`userData/${this.currentUserData.email}/plans`,scheduleId),data)
        }catch(err){console.log(err)}

        this.$clearForm();

        if(this.scheduleProps.date !== this.thisDate)
        this.$emit('closePopup');
      }
    },
    $addRecordItem(){
      console.log('add record');
    },
    async $addTimesItem(){
      let props = this.timesProps
      if(props.topic === null || props.topic === '') return alert('기록 주제를 선택해주세요.');
      if(this.selectedStartTime === null || this.selectedEndTime === null ||(new Date(props.endTime).getTime() - new Date(props.startTime).getTime()) <= 0) return alert('기록 시간을 확인해주세요.');

      const timesId = `times@${uuid().replaceAll('-','')}`;

      let data = {
        id: timesId,
        date: this.$route.params.dayId,
        topic: this.timesProps.topic,
        startTime: this.timesProps.startTime,
        endTime: this.timesProps.endTime
      }

      try{
        await setDoc(doc(db,`userData/${this.currentUserData.email}/times`,timesId),data)
      }catch(err){console.log(err)}

      this.$emit('closePopup');

    },
    async $addTopic(e){
      e.preventDefault();
      console.log('add topic');
      if(this.topics.length === 10) return alert('기록 주제는 최대 10개까지 설정할 수 있습니다.');
      if(this.topics.includes(this.inputTopic)) {
        alert('이미 존재하는 기록 주제입니다.');
        this.inputTopic = null;
        return;
      }
      let list = [...this.topics];
      list.push(this.inputTopic);

      let data = {
        id: this.currentUserData.id,
        email: this.currentUserData.email,
        username: this.currentUserData.username,
        topics: list
      }
      try{
        await setDoc(doc(db,`userData`,this.currentUserData.email),data)
      }catch(err){
        console.log(err)
      }

      this.inputTopic = null;
    },
    async $deleteTopic(topic){
      const isDelete = confirm(`"${topic}" 기록 주제를 삭제하시겠습니까?`);
      if(! isDelete) return;
      let list = this.topics.filter(item => item !== topic);
      let data = {
        id: this.currentUserData.id,
        email: this.currentUserData.email,
        username: this.currentUserData.username,
        topics: list
      }
      try{
        await setDoc(doc(db,`userData`,this.currentUserData.email),data)
      }catch(err){
        console.log(err)
      }
    },
    $cancel(){
      this.$clearForm();
      this.$emit('closePopup');
    },
    $clearForm(){
      this.dDayDate = null;
      this.dDayProps = {title: null, date: null,};
    }
  },
  mounted(){
    console.log(this.mode);
    switch (this.mode){
      case 'dDay':
        this.title = 'D-day 추가'; break;
      case 'schedule':
        this.title = '일정 추가'; break;
      case 'record':
        this.title = '오늘의 기록'; break;
      case 'times':
        this.title = '시간기록 추가'; break;
      case 'topics':
        this.title = '기록 주제 설정'; break;
      default: break;
    }
  }
}
</script>

<style lang="scss">
#popup{
  position: absolute;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  padding: 1rem;
  .contentsWrap{
    background-color: var(--color-main);
    min-height: 300px;
    display: flex;
    flex-direction: column;
    .contents{
      flex-grow: 1;
    }
    input.title{
      font-size: 1.2rem;
      border: 0;
      padding: 0.5rem 0;
      padding-left: 12px;
      width: 100%;
      border-bottom: 1px solid var(--color-text);
      font-weight: 700;
      &::placeholder{
        color: #959595;
      }
    }
    .buttonPlace{
      display: flex;
      justify-content: flex-end;
      column-gap: 1rem;
      button{
        background: transparent;
        width: 100px;
      }
    }

    .recordPopup{
      form{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        column-gap: 0.5rem;
        #fileBox{
          display: flex;
          border: 1px solid var(--color-text);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          .uploadName:disabled {
            flex: 1;
            background-color: transparent;
            border: 0;
            padding-left: 0.5rem;
            min-width: 0;
          }
          label {
            padding: 0.2rem 0.5rem;
            background-color: var(--color-text);
            color: white;
          }
          #diaryFile {
            display: none;
          }
        }
        #imgViewer {
          height: 200px;
          border: 1px solid var(--color-text);
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: calc(100% - 0.5rem);
            height: calc(100% - 0.5rem);
            object-fit: contain;
          }
        }
        hr {
          margin: 0.5rem 0;
          border: 0;
          border-top: 1px solid var(--color-text);
        }
        #diaryContent {
          width: 100%;
          height: 100px;
          resize: none;
          outline: 0;
          border: 0;
          padding: 0.5rem;
          font-size: 0.9rem;
          color: inherit;
          font-family: inherit;
        }
      }
    }
    .datepicker{
      padding-bottom: 1rem;
      .dp__input{
        font-family: 'GowunDodum-Regular';
        border: 0;
      }
    }
    .editTopic{
      form{
        display: flex;
        align-items: center;
        //border-top: 1px solid var(--color-text);
        border-bottom: 1px solid var(--color-text);
        padding: 0.5rem 0;
        input[type='text']{
          flex-grow: 1;
          font-size: 1.2rem;
          border: 0;
          padding-left: 0.5rem;
        }
        input[type='submit']{
          background: var(--color-text);
          color: var(--color-main);
        }
      }
      .btnSetting{
        width: 50px;
        background: transparent;
        border: 1px solid var(--color-text);
        padding: 0.2rem 0;
        font-size: 0.8rem;
      }
      ul{
        li{
          display: flex;
          align-items: start;
          margin: 0.5rem 0;
          span{
            line-height: 1.5rem;
            flex-grow: 1;
          }
          button{
            height: 1.5rem;
            flex-shrink: 0;
          }
        }
      }
      > p{
        position: relative;
        padding-left: 1.2rem;
        font-size: 0.7rem;
        font-weight: 700;
        opacity: 0.6;
        line-height: 1.2rem;
        &::before{
          content: '※';
          position: absolute;
          left: 0;
        }
        &:first-of-type{
          margin-top: 1rem;
        }
        &:last-of-type{
          margin-bottom: 2rem;
        }
      }
    }
    .timesPopup{
      select{
        -o-appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        /* IE */
        &::-ms-expand {
          display: none;
        }

        width: 100%;
        text-align: center;
      }
      .timePickerPlace{
        //display: flex;
        text-align: center;
        .datepicker{
          padding: 0;
          &:first-of-type{
            border-bottom: 1px solid var(--color-text);
          }
        }
      }
    }
  }
}
</style>
