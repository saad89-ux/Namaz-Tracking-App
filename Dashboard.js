
import {
  app,
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  setDoc
} from "./Fireapp.js";

let UserData;


let fetchuserData = async () => {
  try {
    let uid = localStorage.getItem("uid");
    let user = await getDoc(doc(db, "users", uid));
    UserData = user.data();
    console.log(" User fetched:", uid, user.data());
  } catch (error) {
    console.log(" Error while fetching user:", error.message);
  }
};


let Checkingroute = () => {
  let uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.assign("/Login.html");
  }
};


let getFirestoreDateKey = () => {
  return new Date().toISOString().split("T")[0];
};


let getTodayDate = () => {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  return `${day}/${month}/${year}`;
};


let Assigingdate = document.getElementById("TodaysDate");
Assigingdate.innerHTML = `Today: ${getTodayDate()}`;


let checkingStatus = async () => {
  try {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      console.error("User UID not found in localStorage");
      return;
    }

    let todayKey = getFirestoreDateKey();
    let prayerDocRef = doc(db, "users", uid, "prayers", todayKey);

    let defaultStatus = {
      fajr: false,
      zuhur: false,
      asar: false,
      maghrib: false,
      isha: false,
    };

    let docSnap = await getDoc(prayerDocRef);
    let Allstatus = {};

    if (docSnap.exists()) {
      Allstatus = { ...defaultStatus, ...docSnap.data() };
      console.log("Prayer data found:", Allstatus);
    } else {
      Allstatus = defaultStatus;
      await setDoc(prayerDocRef, Allstatus);
      console.log("New prayer doc created:", Allstatus);
    }

    RenderingToggleButtons(Allstatus, prayerDocRef);

  } catch (error) {
    console.log("Error in checkingStatus:", error.message);
  }
};
 

let RenderingToggleButtons = (Allstatus, docRef) => {
  if (!Allstatus) {
    console.error(" No data to show prayer buttons.");
    return;
  }

  const prayerCards = document.querySelectorAll(".prayer-card");

  prayerCards.forEach((card) => {
    const prayerName = card.querySelector("h3").innerText.toLowerCase().trim();
    const missBtn = card.querySelector(".miss");
    const doneBtn = card.querySelector(".done");

    if (!Allstatus.hasOwnProperty(prayerName)) {
      console.warn(` Prayer "${prayerName}" not in data.`);
      return;
    }

    
    if (Allstatus[prayerName]) {
      doneBtn.style.backgroundColor = "darkgreen";
      missBtn.style.backgroundColor = "gray";
      missBtn.style.display = "none";
    } else {
      doneBtn.style.backgroundColor = "gray";
      missBtn.style.backgroundColor = "red";
      doneBtn.style.display = "none";
    }


    if (!doneBtn.dataset.attached) {
      doneBtn.addEventListener("click", async () => {
        console.log(` ${prayerName.toUpperCase()} marked as DONE`,Allstatus);
        Allstatus[prayerName] = true;
        await setDoc(docRef, Allstatus);
        doneBtn.style.backgroundColor = "darkgreen";
        missBtn.style.backgroundColor = "gray";
        missBtn.style.display = "none"; 
        missBtn.style.display = "none";
      });
      doneBtn.dataset.attached = "true";
    }

    if (!missBtn.dataset.attached) {
      missBtn.addEventListener("click", async () => {
        console.log(` ${prayerName.toUpperCase()} marked as MISSED`,Allstatus);
        Allstatus[prayerName] = false;
        await setDoc(docRef, Allstatus);
        missBtn.style.backgroundColor = "red";
        doneBtn.style.backgroundColor = "gray";
        doneBtn.style.display = "none";
      });
      missBtn.dataset.attached = "true";
    }
  });
}

window.toggleMenu = function () {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
};

window.logout = function () {
  localStorage.removeItem("uid");
  window.location.href = "./login.html";
};


window.RenderingToggleButtons = RenderingToggleButtons;
window.checkingStatus = checkingStatus;
window.fetchuserData = fetchuserData;
window.getTodayDate = getTodayDate;
window.Checkingroute = Checkingroute;
window.getFirestoreDateKey = getFirestoreDateKey;


window.addEventListener("DOMContentLoaded", () => {
  Checkingroute();         
  fetchuserData();         
  checkingStatus();  
  getTodayDate();   
  getFirestoreDateKey();
}); 

