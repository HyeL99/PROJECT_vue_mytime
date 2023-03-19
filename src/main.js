import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

createApp(App).use(store).use(router).component('VueDatePicker', VueDatePicker).mount('#app');

/* 파이어베이스 데이터 업데이트 설정 */
import { db } from '@/firebase';
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore';

const qUserData =  query(collection(db,"userData"));
let list = [];
getDocs(qUserData).then(qSnapshot => {
  qSnapshot.forEach(doc => list = [...list, doc.data()]);
})

let email = localStorage.getItem('MT_E');
if(!!email){
  store.dispatch('$doLogin',email);
}
