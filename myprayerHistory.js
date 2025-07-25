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
  setDoc,
  where,
  query,
} from "./Fireapp.js";

let Checkingroute = () => {
  let uid = localStorage.getItem("uid");
  
  if (!uid) {

    window.location.replace("Login.html");
  } else {
    console.log("User authenticated, loading history...");

  }
};



let formatDateAsKey = (date) => {
  return date.toLocaleDateString("en-CA"); 
};

let getLastNDates = (numberOfDays = 7) => {
  let dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    let currentDate = new Date(); 
    currentDate.setDate(currentDate.getDate() - i);
    dates.push(formatDateAsKey(currentDate));
  }
  return dates;
};


let FetchingPrayersHistory = async () => {
  let placeToShowCards = document.getElementById("historyContainer");
  let dropdown = document.getElementById("range");
  let daysUserWants = parseInt(dropdown.value);

  let allowedDates = getLastNDates(daysUserWants);
  console.log("Allowed Dates:", allowedDates); 

  try {
    let userID = localStorage.getItem("uid");
    let userPrayersCollection = await getDocs(collection(db, "users", userID, "prayers"));

    placeToShowCards.innerHTML = "";

    userPrayersCollection.forEach((oneDayData) => {
      let dateOfThisRecord = oneDayData.id;
      console.log("Firestore Date:", dateOfThisRecord);
      console.log("Firestore Record Found:", oneDayData.id);

      if (allowedDates.includes(dateOfThisRecord)) {
        let card = `
          <div class="prayer-day-card">
            <h3 class="date-heading"> ${dateOfThisRecord}</h3>
            <div class="prayers-grid">
              <div class="prayer-card"><h3>Fajr</h3><img src="Images/Fajar.jpg"><button class="miss">❌ Miss</button><button class="done">✅ Done</button></div>
              <div class="prayer-card"><h3>Zuhur</h3><img src="Images/Zuhur.jpg"><button class="miss">❌ Miss</button><button class="done">✅ Done</button></div>
              <div class="prayer-card"><h3>Asar</h3><img src="Images/Asar.jpg"><button class="miss">❌ Miss</button><button class="done">✅ Done</button></div>
              <div class="prayer-card"><h3>Maghrib</h3><img src="Images/maghrib.jpg"><button class="miss">❌ Miss</button><button class="done">✅ Done</button></div>
              <div class="prayer-card"><h3>Isha</h3><img src="Images/isha.jpg"><button class="miss">❌ Miss</button><button class="done">✅ Done</button></div>
            </div>
          </div>
        `;
        placeToShowCards.innerHTML += card;
      }
    });
    UpdatingPrayerHistoryStatus();
  } catch (error) {
    console.log("Something went wrong:", error.message);
  }
};



let UpdatingPrayerHistoryStatus = async () => {
  let allDays = document.querySelectorAll(".prayer-day-card");

  for (let oneDayCard of allDays) {
    let date = oneDayCard.querySelector(".date-heading").innerText;
    let prayers = oneDayCard.querySelectorAll(".prayer-card");

    let uid = localStorage.getItem("uid");
    let prayerRef = doc(db, "users", uid, "prayers", date);
    let docSnap = await getDoc(prayerRef);
    let statusData = docSnap.exists() ? docSnap.data() : {};

    prayers.forEach((prayerCard) => {
      let prayerName = prayerCard.querySelector("h3").innerText.toLowerCase();
      let doneBtn = prayerCard.querySelector(".done");
      let missBtn = prayerCard.querySelector(".miss");

    
      if (statusData[prayerName]) {
        doneBtn.style.display = "inline-block";
        missBtn.style.display = "none";
        doneBtn.style.backgroundColor = "darkgreen";
      } else {
        missBtn.style.display = "inline-block";
        doneBtn.style.display = "none";
        missBtn.style.backgroundColor = "red";
      }

      
      doneBtn.addEventListener("click", async () => {
        try {
          await updateDoc(prayerRef, { [prayerName]: false });
          doneBtn.style.display = "none";
          missBtn.style.display = "inline-block";
          missBtn.style.backgroundColor = "red";

          let updated = await getDoc(prayerRef);
          console.log(`Updated for ${date}:`, updated.data());
        } catch (err) {
          console.log("Error updating to MISSED:", err.message);
        }
      });

    
      missBtn.addEventListener("click", async () => {
        try {
          await updateDoc(prayerRef, { [prayerName]: true });
          missBtn.style.display = "none";
          doneBtn.style.display = "inline-block";
          doneBtn.style.backgroundColor = "darkgreen";

          let updated = await getDoc(prayerRef);
          console.log(`Updated for ${date}:`, updated.data());
        } catch (err) {
          console.log("Error updating to DONE:", err.message);
        }
      });
    });
  }
};



document.addEventListener("DOMContentLoaded", () => {
    FetchingPrayersHistory(); 
    document
      .getElementById("range")
      .addEventListener("change", FetchingPrayersHistory); 
  })

  
window.UpdatingPrayerHistoryStatus = UpdatingPrayerHistoryStatus;
window.FetchingPrayersHistory=FetchingPrayersHistory;
window.Checkingroute = Checkingroute;
window.getLastNDates = getLastNDates;



