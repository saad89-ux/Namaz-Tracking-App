import { auth  , signInWithEmailAndPassword} from "./Fireapp.js"

let loginHandler = async ()=>{
  try {
     let Email = document.getElementById("email");
     let password = document.getElementById("password");
     if(!Email || !password){
         console.log("Required fields are missing");
         return;
     }
     let userresponse = await signInWithEmailAndPassword(auth , Email.value , password.value);
     console.log(userresponse.user.uid);
     localStorage.setItem("uid", userresponse.user.uid) ;
     window.location.assign("/Dashboard.html");
  } catch (error) {
     console.log(error.message);
  }
}
   let Checking = ()=>{
    let uid = localStorage.getItem("uid");
    if(uid){
        window.location.assign("/Dashboard.html");
    }
}
window.loginHandler = loginHandler;
window.Checking = Checking ;