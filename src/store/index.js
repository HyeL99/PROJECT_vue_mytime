import { createStore } from 'vuex'
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
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
        qPlanSnap.forEach(doc => list = [...list,doc.data()]);
        userData.plans = list;

        list = [];
        const qDDay = query(collection(db, `userData/${email}/dDay`));
        const qDDaySnap = await getDocs(qDDay);
        qDDaySnap.forEach(doc => list = [...list,doc.data()]);
        userData.dDay = list;

        list = [];
        const qRecords = query(collection(db, `userData/${email}/records`));
        const qRecordsSnap = await getDocs(qRecords);
        qRecordsSnap.forEach(doc => list = [...list,doc.data()]);
        userData.records = list;

        list = [];
        const qTimes = query(collection(db, `userData/${email}/times`));
        const qTimesSnap = await getDocs(qTimes);
        qTimesSnap.forEach(doc => list = [...list,doc.data()]);
        userData.times = list;

        list = [];
        const qTodoList = query(collection(db, `userData/${email}/todoList`));
        const qTodoListSnap = await getDocs(qTodoList);
        qTodoListSnap.forEach(doc => list = [...list,doc.data()]);
        userData.todoList = list;
      }).catch(err => console.log(err));
      commit('$setCurrentUser',userData);
    },
    $doLogin({commit,dispatch},email){
      commit('$handleLoadingMode',true);
      commit('$handleLoginMode',true);
      commit('$setLoginEmail',email);
      dispatch('$getUserData').then(()=>commit('$handleLoadingMode',false));
    }
  },
  modules: {
  }
})
