import { createStore } from 'vuex'
import {collection, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import {db} from "@/firebase";

export default createStore({
  state: {
    isLoading: false,
    isLogin: false,
    loginEmail: null,
    currentUserData: null,
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
      sessionStorage.setItem('MT_E',payload)
    },
    $logout(state){
      state.isLogin = false;
      state.loginEmail = null;
      state.currentUserData = null;
      sessionStorage.removeItem('MT_E')
    },
    $setCurrentUser(state,payload){
      state.currentUserData = payload;
    },
    $updateDDayData(state, payload){
      state.currentUserData.dDay = payload;
    },
    $updateTodoData(state, payload){
      state.currentUserData.todoList = payload;
    }
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
