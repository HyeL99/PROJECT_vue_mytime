<template>
<main>
  <section>
    <h2>Todo List</h2>
    <hr>
    <button @click="$filterList('all')">ALL</button>
    <button @click="$filterList('active')">active</button>
    <button @click="$filterList('done')">done</button>
    <hr>
    <ul>
      <li v-for="item in todos" :key="item.id">
        <label>
          <input type="checkbox" :checked="item.isDone" @change="$changeChk(item)">
          <span>{{ item.name }}</span>
        </label>
        <button @click="$deleteTodo(item.id)">삭제</button>
      </li>
    </ul>
  </section>
  <form @submit="$addTodoItem">
    <input type="text" v-model.trim="inputData">
    <input type="submit" value="+">
  </form>
</main>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {v4 as uuid} from "uuid";
import {setDoc, doc, query, collection, onSnapshot, deleteDoc} from "firebase/firestore";
import {db} from "@/firebase";
import cmn from "@/js/common";

export default {
  name: "TodoView",
  computed:{
    ...mapState(['currentUserData'])
  },
  data(){
    return{
      inputData: null,
      todos: [],
      todosDefault: [],
    }
  },
  methods:{
    ...mapMutations(['$updateTodoData']),
    async $addTodoItem(e){
      e.preventDefault();
      if(this.inputData === null || this.inputData === ''){
        alert('입력된 할 일이 없습니다.');
        return;
      }
      console.log('실행')
      let todoId = `todo@${uuid().replaceAll('-','')}`
      let data = {
        id: todoId,
        name: this.inputData,
        isDone: false,
      }
      try{
        await setDoc(doc(db, `userData/${this.currentUserData.email}/todoList`,todoId),data);
        this.inputData = null;
      }catch(err){console.log(err)}
    },
    async $changeChk(item){
      let data = item;
      data.isDone = !data.isDone
      try{
        await setDoc(doc(db, `userData/${this.currentUserData.email}/todoList`,item.id),data)
      }catch(err){console.log(err)}
    },
    async $deleteTodo(id){
      try{
        await deleteDoc(doc(db, `userData/${this.currentUserData.email}/todoList`, id))
      }catch(err){console.log(err)}
    },
    $filterList(mode) {
      switch (mode){
        case 'all':
          this.todos = [...this.todosDefault];
          break;
        case 'active':
          this.todos = this.todosDefault.filter(item => item.isDone === false);
          break;
        case 'done':
          this.todos = this.todosDefault.filter(item => item.isDone === true);
          break;
        default: break;
      }
    }
  },
  mounted(){
    this.todos = this.currentUserData.todoList;
    this.todosDefault = this.todos;

    const qTodo = query(collection(db, `userData/${this.currentUserData.email}/todoList`));

    const unsub = onSnapshot(qTodo, (qSnapshot) => {
      let list = [];
      qSnapshot.forEach(doc => list = [...list, doc.data()]);

      this.todos = list.sort((a,b) => a.name > b.name ? 1 : -1);
      this.todosDefault = this.todos;

      this.$updateTodoData(list);
    })
  }
}
</script>
