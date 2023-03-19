import { createStore } from 'vuex'
import {collection, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import {db} from "@/firebase";

export default createStore({
  state: {
    isLoading: false,
    isLogin: false,
    loginEmail: null,
    currentUserData: null,
    holidays: [
      {
        name:'새해',
        month: '01',
        day: '01'
      },
      {
        name:'삼일절',
        month: '03',
        day: '01'
      },
      {
        name:'어린이날',
        month: '05',
        day: '05'
      },
      {
        name:'현충일',
        month: '06',
        day: '06'
      },
      {
        name:'광복절',
        month: '08',
        day: '15'
      },
      {
        name:'개천절',
        month: '10',
        day: '03'
      },
      {
        name:'한글날',
        month: '10',
        day: '09'
      },
      {
        name:'크리스마스',
        month: '12',
        day: '25'
      },
    ],
    lunarDays: [ // 2015-2030 구현 완
      {
        year: 2015,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"18"
          },
          {
            name:"설날",
            month:"02",
            day:"19"
          },
          {
            name:"설연휴",
            month:"02",
            day:"20"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"25"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"26"
          },
          {
            name:"추석",
            month:"09",
            day:"27"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"28"
          },
          {
            name:"대체공휴일",
            month:"09",
            day:"29"
          }
        ]
      },  //2015
      {
        year: 2016,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"07"
          },
          {
            name:"설날",
            month:"02",
            day:"08"
          },
          {
            name:"설연휴",
            month:"02",
            day:"09"
          },
          {
            name:"대체공휴일",
            month:"02",
            day:"10"
          },
          {
            name:"제20대 국회의원 선거",
            month:"04",
            day:"13"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"14"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"14"
          },
          {
            name:"추석",
            month:"09",
            day:"15"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"16"
          }
        ]
      },  //2016
      {
        year: 2017,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"27"
          },
          {
            name:"설날",
            month:"01",
            day:"28"
          },
          {
            name:"설연휴",
            month:"01",
            day:"29"
          },
          {
            name:"대체공휴일",
            month:"01",
            day:"30"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"03"
          },
          {
            name:"제19대 대통령 선거",
            month:"05",
            day:"09"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"03"
          },
          {
            name:"추석",
            month:"10",
            day:"04"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"05"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"06"
          },
        ]
      },  //2017
      {
        year: 2018,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"15"
          },
          {
            name:"설날",
            month:"02",
            day:"16"
          },
          {
            name:"설연휴",
            month:"02",
            day:"17"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"07"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"12"
          },
          {
            name:"제7회 전국동시지방선거",
            month:"06",
            day:"13"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"23"
          },
          {
            name:"추석",
            month:"09",
            day:"24"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"25"
          },
          {
            name:"대체공휴일",
            month:"09",
            day:"26"
          },
        ]
      },  //2018
      {
        year: 2019,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"04"
          },
          {
            name:"설날",
            month:"02",
            day:"05"
          },
          {
            name:"설연휴",
            month:"02",
            day:"06"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"06"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"12"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"12"
          },
          {
            name:"추석",
            month:"09",
            day:"13"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"14"
          },
        ]
      },  //2019
      {
        year: 2020,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"24"
          },
          {
            name:"설날",
            month:"01",
            day:"25"
          },
          {
            name:"설연휴",
            month:"01",
            day:"26"
          },
          {
            name:"대체공휴일",
            month:"01",
            day:"27"
          },
          {
            name:"제21대 국회의원 선거",
            month:"04",
            day:"15"
          },
          {
            name:"석가탄신일",
            month:"04",
            day:"30"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"30"
          },
          {
            name:"추석",
            month:"10",
            day:"01"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"02"
          },
        ]
      },  //2020
      {
        year: 2021,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"11"
          },
          {
            name:"설날",
            month:"02",
            day:"12"
          },
          {
            name:"설연휴",
            month:"02",
            day:"13"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"19"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"20"
          },
          {
            name:"추석",
            month:"09",
            day:"21"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"22"
          },
        ]
      },  //2021
      {
        year: 2022,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"31"
          },
          {
            name:"설날",
            month:"02",
            day:"01"
          },
          {
            name:"설연휴",
            month:"02",
            day:"02"
          },
          {
            name:"제20대 대통령 선거",
            month:"03",
            day:"09"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"08"
          },
          {
            name:"제8회 전국동시지방선거",
            month:"06",
            day:"01"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"09"
          },
          {
            name:"추석",
            month:"09",
            day:"10"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"11"
          },
          {
            name:"대체공휴일",
            month:"09",
            day:"12"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"10"
          },
        ]
      },  //2022
      {
        year: 2023,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"21"
          },
          {
            name:"설날",
            month:"01",
            day:"22"
          },
          {
            name:"설연휴",
            month:"01",
            day:"23"
          },
          {
            name:"대체공휴일",
            month:"01",
            day:"24"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"27"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"28"
          },
          {
            name:"추석",
            month:"09",
            day:"29"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"30"
          }
        ]
      },  //2023
      {
        year: 2024,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"09"
          },
          {
            name:"설날",
            month:"02",
            day:"10"
          },
          {
            name:"설연휴",
            month:"02",
            day:"11"
          },
          {
            name:"대체공휴일",
            month:"02",
            day:"12"
          },
          {
            name:"제22대 국회의원 선거",
            month:"04",
            day:"10"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"06"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"15"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"16"
          },
          {
            name:"추석",
            month:"09",
            day:"17"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"18"
          }
        ]
      },  //2024
      {
        year: 2025,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"28"
          },
          {
            name:"설날",
            month:"01",
            day:"29"
          },
          {
            name:"설연휴",
            month:"01",
            day:"30"
          },
          {
            name:"대체공휴일",
            month:"03",
            day:"03"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"05"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"06"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"06"
          },
          {
            name:"추석",
            month:"10",
            day:"07"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"08"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"09"
          }
        ]
      },  //2025
      {
        year: 2026,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"16"
          },
          {
            name:"설날",
            month:"02",
            day:"17"
          },
          {
            name:"설연휴",
            month:"02",
            day:"18"
          },
          {
            name:"대체공휴일",
            month:"03",
            day:"02"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"24"
          },
          {
            name:"제9회 전국동시지방선거",
            month:"06",
            day:"03"
          },
          {
            name:"대체공휴일",
            month:"08",
            day:"17"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"24"
          },
          {
            name:"추석",
            month:"09",
            day:"25"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"26"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"05"
          }
        ]
      },  //2026
      {
        year: 2027,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"06"
          },
          {
            name:"설날",
            month:"02",
            day:"07"
          },
          {
            name:"설연휴",
            month:"02",
            day:"08"
          },
          {
            name:"대체공휴일",
            month:"02",
            day:"09"
          },
          {
            name:"제21대 대통령 선거",
            month:"03",
            day:"03"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"13"
          },
          {
            name:"대체공휴일",
            month:"08",
            day:"16"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"14"
          },
          {
            name:"추석",
            month:"09",
            day:"15"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"16"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"04"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"11"
          }
        ]
      },  //2027
      {
        year: 2028,
        dayList:[
          {
            name:"설연휴",
            month:"01",
            day:"26"
          },
          {
            name:"설날",
            month:"01",
            day:"27"
          },
          {
            name:"설연휴",
            month:"01",
            day:"28"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"02"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"02"
          },
          {
            name:"추석",
            month:"10",
            day:"03"
          },
          {
            name:"추석연휴",
            month:"10",
            day:"04"
          },
          {
            name:"대체공휴일",
            month:"10",
            day:"05"
          }
        ]
      },  //2028
      {
        year: 2029,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"12"
          },
          {
            name:"설날",
            month:"02",
            day:"13"
          },
          {
            name:"설연휴",
            month:"02",
            day:"14"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"07"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"20"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"21"
          },
          {
            name:"추석",
            month:"09",
            day:"22"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"23"
          },
          {
            name:"대체공휴일",
            month:"09",
            day:"24"
          }
        ]
      },  //2029
      {
        year: 2030,
        dayList:[
          {
            name:"설연휴",
            month:"02",
            day:"02"
          },
          {
            name:"설날",
            month:"02",
            day:"03"
          },
          {
            name:"설연휴",
            month:"02",
            day:"04"
          },
          {
            name:"대체공휴일",
            month:"02",
            day:"05"
          },
          {
            name:"대체공휴일",
            month:"05",
            day:"06"
          },
          {
            name:"석가탄신일",
            month:"05",
            day:"09"
          },
          {
            name:"제10회 전국동시지방선거",
            month:"06",
            day:"12"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"11"
          },
          {
            name:"추석",
            month:"09",
            day:"12"
          },
          {
            name:"추석연휴",
            month:"09",
            day:"13"
          }
        ]
      }  //2030
    ]
  },
  getters: {
  },
  mutations: {
    $handleLoginMode(state,payload){
      state.isLogin = payload;
    },
    $handleLoadingMode(state,payload){
      state.isLoading = payload;
    },
    $setLoginEmail(state,payload){
      state.loginEmail = payload;
      localStorage.setItem('MT_E',payload)
    },
    $logout(state){
      state.isLogin = false;
      state.loginEmail = null;
      state.currentUserData = null;
      localStorage.removeItem('MT_E')
    },
    $setCurrentUser(state,payload){
      state.currentUserData = payload;
    },
    $updateDDayData(state, payload){
      state.currentUserData.dDay = payload;
    },
    $updateTodoData(state, payload){
      state.currentUserData.todoList = payload;
    },
    $updatePlanData(state, payload){
      state.currentUserData.plans = payload;
    },
    $updateTopicData(state, payload){
      state.currentUserData.topics = payload;
    },
    $updateTimesData(state, payload){
      state.currentUserData.times = payload;
    },
    $updateRecordData(state, payload){
      state.currentUserData.records = payload;
    },
  },
  actions: {
    async $getUserData({state,commit}){
      const docRef = doc(db, 'userData',state.loginEmail);
      const email = state.loginEmail
      // const email = 'test01@example.com';
      // const docRef = doc(db, 'userData',email);
      let userData = null;
      await getDoc(docRef).then(async res => {
        userData = res.data();

        let list = [];
        const qPlan = query(collection(db, `userData/${email}/plans`));
        const qPlanSnap = await getDocs(qPlan);
        qPlanSnap?.forEach(doc => list = [...list,doc.data()]);
        userData.plans = list.sort((a,b) => new Date(a.date) - new Date(b.date));

        list = [];
        const qDDay = query(collection(db, `userData/${email}/dDay`));
        const qDDaySnap = await getDocs(qDDay);
        qDDaySnap?.forEach(doc => list = [...list,doc.data()]);
        userData.dDay = list.sort((a,b) => new Date(a.date) - new Date(b.date));

        list = [];
        const qRecords = query(collection(db, `userData/${email}/records`));
        const qRecordsSnap = await getDocs(qRecords);
        qRecordsSnap?.forEach(doc => list = [...list,doc.data()]);
        userData.records = list.sort((a,b) => new Date(a.date) - new Date(b.date));

        list = [];
        const qTimes = query(collection(db, `userData/${email}/times`));
        const qTimesSnap = await getDocs(qTimes);
        qTimesSnap?.forEach(doc => list = [...list,doc.data()]);
        userData.times = list.sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

        list = [];
        const qTodoList = query(collection(db, `userData/${email}/todoList`));
        const qTodoListSnap = await getDocs(qTodoList);
        qTodoListSnap?.forEach(doc => list = [...list,doc.data()]);
        userData.todoList = list.sort((a,b) => name > b.name ? 1 : -1);
      }).catch(err => console.log(err));
      commit('$setCurrentUser',userData);
    },
    $doLogin({commit,dispatch},email){
      commit('$handleLoadingMode',true);
      commit('$handleLoginMode',true);
      commit('$setLoginEmail',email);
      dispatch('$getUserData').then(()=>commit('$handleLoadingMode',false));
    },
  },
  modules: {
  }
})
