import { auth , createUserWithEmailAndPassword , addDoc , collection , db ,doc , setDoc } from "./Fireapp.js";


let Checking = () => {
  let uid = localStorage.getItem("uid");
  if(uid){
    window.location.assign("/Dashboard.html");
  }
}

let userAccount = async ()=>{
   try {
     let firstname = document.getElementById("firstname");
    let lastname = document.getElementById("lastname");
    let Email = document.getElementById("email");     
    let useraname = document.getElementById("username");     
    let password = document.getElementById("password");     
    const response = await createUserWithEmailAndPassword(auth , Email.value , password.value);
    let userid = response.user.uid ;
    let userdata = {
        fullname : firstname.value + " " + lastname.value , 
        Email : Email.value ,
        useraname : useraname.value ,
        password : password.value ,
    }
    const userRes = await setDoc(doc(db, "users", userid), userdata);
  

    window.location.assign("/login.html");
   } catch (error) {
     console.log(error.message);
   }
}


window.userAccount =  userAccount;
window.Checking = Checking ;