import {
  db,
  doc,
  getDoc,
  setDoc,
} from "./Fireapp.js";

let UserData;

let Checkingroute = () => {
  let uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.assign("Login.html");
  }
};

let fetchuserData = async () => {
  try {
    let uid = localStorage.getItem("uid");
    let user = await getDoc(doc(db, "users", uid));
    UserData = user.data();
    console.log("User Data:", UserData);
  } catch (error) {
    console.log("Error fetching user data:", error.message);
  }
};

let getTodayDate = () => {
  let today = new Date();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

let getFirestoreDateKey = () => {
  return new Date().toISOString().split("T")[0]; 
};

let Assigingdate = document.getElementById("TodaysDate");
Assigingdate.innerHTML = `Today: ${getTodayDate()}`;

let checkingStatus = async () => {
  let uid = localStorage.getItem("uid");
  if (!uid) return;

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
  let Allstatus = docSnap.exists() ? { ...defaultStatus, ...docSnap.data() } : defaultStatus;

  if (!docSnap.exists()) {
    await setDoc(prayerDocRef, Allstatus);
  }

  RenderingToggleButtons(Allstatus, prayerDocRef);
};

let RenderingToggleButtons = (Allstatus, docRef) => {
  let prayerCards = document.querySelectorAll(".prayer-card");

  prayerCards.forEach((card) => {
    let prayerName = card.querySelector("h3").innerText.toLowerCase().trim();
    let missBtn = card.querySelector(".miss");
    let doneBtn = card.querySelector(".done");

    if (Allstatus[prayerName]) {
      doneBtn.style.display = "inline-block";
      missBtn.style.display = "none";
      doneBtn.style.backgroundColor = "darkgreen";
    } else {
      missBtn.style.display = "inline-block";
      doneBtn.style.display = "none";
      missBtn.style.backgroundColor = "red";
    }

    if (!doneBtn.dataset.bound) {
      doneBtn.addEventListener("click", async () => {
        Allstatus[prayerName] = false;
        await setDoc(docRef, Allstatus);
        doneBtn.style.display = "none";
        missBtn.style.display = "inline-block";
        missBtn.style.backgroundColor = "red";
        console.log(`${prayerName} marked as MISSED`);
      });
      doneBtn.dataset.bound = "true";
    }

    if (!missBtn.dataset.bound) {
      missBtn.addEventListener("click", async () => {
        Allstatus[prayerName] = true;
        await setDoc(docRef, Allstatus);
        missBtn.style.display = "none";
        doneBtn.style.display = "inline-block";
        doneBtn.style.backgroundColor = "darkgreen";
        console.log(`${prayerName} marked as DONE`);
      });
      missBtn.dataset.bound = "true";
    }
  });
};

window.toggleMenu = function () {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("active");
};


window.addEventListener("DOMContentLoaded", () => {
  Checkingroute();
  fetchuserData();
  checkingStatus();
});


 let logout=()=> {
  localStorage.removeItem("uid");
  window.location.href = "./login.html";
}

window.logout = logout;
