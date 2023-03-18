<template>
<main class="todoView">
  <section>
    <h2>Todo List</h2>
    <div class="navBtns">
      <button @click="$filterList('all')" :class="thisMode === 'all' ? 'on': ''">ALL</button>
      <button @click="$filterList('active')" :class="thisMode === 'active' ? 'on': ''">active</button>
      <button @click="$filterList('done')" :class="thisMode === 'done' ? 'on': ''">done</button>
    </div>
    <ul>
      <li v-for="item in todos" :key="item.id">
        <div :class="item.isDone ? 'checked contentsWrap' : 'contentsWrap'">
          <label>
            <img src="@/assets/img/icon_bullet_symbol.svg" alt="">
            <input type="checkbox" :checked="item.isDone" @change="$changeChk(item)">
            <span>{{ item.name }}</span>
          </label>
          <button @click="$deleteTodo(item.id)"><img src="@/assets/img/icon_plus.svg" alt="삭제"></button>
        </div>
      </li>
    </ul>
  </section>
  <form @submit="$addTodoItem">
    <input type="text" v-model.trim="inputData" placeholder="할 일을 입력해주세요.">
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
      thisMode: 'all',
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
      if(this.todos.find(item => item.name === this.inputData)){
        alert('이미 등록된 할 일 입니다.');
        this.inputData = null;
        return;
      }
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
        await setDoc(doc(db, `userData/${this.currentUserData.email}/todoList`,item.id),data);
      }catch(err){console.log(err)}
    },
    async $deleteTodo(id){
      try{
        await deleteDoc(doc(db, `userData/${this.currentUserData.email}/todoList`, id))
      }catch(err){console.log(err)}
    },
    $filterList(mode) {
      this.thisMode = mode;
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
      this.$filterList(this.thisMode);
    })
  }
}
</script>

<style lang="scss">
.todoView{
  display: flex;
  flex-direction: column;
  section{
    flex-grow: 1;
  }
  h2{
    font-size: 1.2rem;
  }
  li{
    border: 1px solid var(--color-text);
    border-bottom: 0;
    padding: 0.5rem;
    &:last-of-type{
      border-bottom: 1px solid var(--color-text);
    }
    .contentsWrap{
      display: flex;
      &.checked{
        label{
          opacity: 0.5;
        }
        span{
          text-decoration: line-through;
        }
      }
    }
     label{
       display: flex;
       column-gap: 0.5rem;
       flex-grow: 1;
       img{
         width: 1.5rem;
         height: 1.5rem;
         flex-shrink: 0;
       }
       input{
         display: none;
       }
       span{
         line-height: 1.5rem;
       }
     }
     button{
       background: transparent;
       border: 0;
       height: 1.5rem;
       transition: all 0.3s;
       &:hover{
         transform: rotate(180deg);
       }
       img{
         height: 1rem;
         width: 1rem;
         transform: rotate(45deg);
       }
     }
   }
  .navBtns{
    padding: 0.3rem 0;
    margin: 0.5rem 0;
    border-top: 1px solid var(--color-text);
    border-bottom: 1px solid var(--color-text);
    display: flex;
    column-gap: 0.5rem;
    button{
      background: transparent;
      width: 50px;
      border: 0;
      opacity: 0.8;
      font-size: 0.9rem;
      transition: all 0.3s ease-out;
      &:hover, &.on{
        opacity: 1;
        font-weight: 700;
      }
    }
  }
  form{
    display: flex;
    input{
      border: 1px solid var(--color-text);
    }
    input[type='text']{
      flex-grow: 1;
      border-radius: 5px 0 0 5px;
      padding: 0.5rem;
    }
    input[type='submit']{
      color: var(--color-main);
      background: var(--color-text);
      width: 2.5rem;
      border-radius: 0 5px 5px 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}

</style>
