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
    </div>
    <div class="buttonPlace">
      <button @click="$addDDayItem" class="box" v-if="mode === 'dDay'">등록</button>
      <button @click="$addScheduleItem" class="box" v-if="mode === 'schedule'">등록</button>
      <button @click="$addRecordItem" class="box" v-if="mode === 'record'">등록</button>
      <button @click="$cancel" class="box">취소</button>
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
    mode: String
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
      }
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
    }
  },
  methods:{
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
      console.log('add record')
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
    color: var(--color-text);
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
  }
}
</style>
