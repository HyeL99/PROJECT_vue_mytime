<template>
<main>
  <button @click="$login">구글로 로그인</button>
</main>
</template>

<script>
import {auth, db} from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import {doc, getDoc, setDoc,collection, getDocs, query} from "firebase/firestore";
import {mapActions, mapMutations} from "vuex";

export default {
  name: "LoginView",
  methods:{
    ...mapMutations(['$handleLoginMode','$setLoginEmail']),
    ...mapActions(['$getUserData','$doLogin']),
    $login(){
      console.log('login');
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).then(async res => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const token = credential.accessToken;
        const user = res.user;
        console.log(res,credential,user);

        let chk = await this.$checkUserInfo(user.email);
        console.log(chk);

        if(chk){
          this.$doLogin(user.email).then(() => this.$router.push({name: 'home'}));
        } else {
          this.$handleLoginMode(false);
          const data = {
            id: user.uid,
            email: user.email,
            topics: [],
            username: 'a',
          }
          await setDoc(doc(db, `userData`,user.email),data).then(res => console.log(res)).catch(err => console.log(err));
        }
      }).catch(err => console.log(err))
    },
    async $checkUserInfo(email){
      const docRef = doc(db,"userData",email);
      const docSnap = await getDoc(docRef);

      return docSnap.exists();
    }
  }
}
</script>
