// تعريف العناصر
let LogOut = document.getElementById("LogOutButton");
let printName = document.getElementById("printName");
let formOFNewNote = document.getElementById("newNote");
let newNoteField = document.getElementById("newNoteField");
let allNotes = document.getElementById("allNotes");
let headerOfNotes = document.getElementById("headerOfNotes");
let page = document.querySelector("#page");
let main = document.getElementById("main");
let header = document.getElementById("header");
let outPage = document.getElementById("outPage");
let textArea = document.getElementById("textArea");
let cancelBtn = document.getElementById("cancel");
let msg = document.getElementById("error");
let btn = document.getElementById("up");

// تعريف المتغيرات
let arrayOfUsers = [];
let idOfUser = JSON.parse(localStorage.getItem("id"));
let arrayOfNotes = [];

// تحميل البيانات من localStorage
moveDataForArray();
moveNotesOfUserForArray();
showNotes();

// تحميل بيانات المستخدمين
function moveDataForArray() {
  if (JSON.parse(localStorage.getItem("users")) !== null) {
    arrayOfUsers = JSON.parse(localStorage.getItem("users"));
  }
}

// تحميل ملاحظات المستخدم
function moveNotesOfUserForArray() {
  if (JSON.parse(localStorage.getItem("data" + idOfUser)) !== null) {
    arrayOfNotes = JSON.parse(localStorage.getItem("data" + idOfUser));
  }
}

// تسجيل الخروج
function logOutProfile() {
  localStorage.setItem("id", JSON.stringify(null));
  window.location = "./index.html";
}

// إضافة ملاحظة جديدة
formOFNewNote.addEventListener("submit", async function (event) {
  if (newNoteField.value.trim() !== "") {
    event.preventDefault();
    let data = await sendDataForChecking(newNoteField.value);
    newNoteField.value = "";
    moveNotesOfUserForArray();
    arrayOfNotes.push(data);
    localStorage.setItem("data" + idOfUser, JSON.stringify(arrayOfNotes));
    showNotes();
  }
});

// عرض الملاحظات
function showNotes() {
  if (idOfUser === null) {
    window.location = "./index.html";
  }
  printName.innerText =
    arrayOfUsers[idOfUser].firstName + " " + arrayOfUsers[idOfUser].lastName;
  let obj = "";
  for (let i = 0; i < arrayOfNotes.length; i++) {
    obj += `<div>
      <p id ="clock">${updateClock()}</p>
      <p >${arrayOfNotes[i]}</p>
      <input type="submit" id="noteText" value="Edit" onclick="showTextArea(${i})">
      <input type="submit" value="Delete" onclick="deleteNote(${i})">
    </div>`;
  }
  allNotes.innerHTML = obj;
  if (obj === "") {
    headerOfNotes.innerHTML = "";
  } else {
    headerOfNotes.innerHTML = `<h2>Your Notes</h2>
      <input type="submit" value="Delete ALL" onclick="deleteAll()">`;
  }
}

// عرض نص الملاحظة للتعديل
let idOfUpdate = null;
function showTextArea(id) {
  idOfUpdate = id;
  main.classList.add("notactive");
  header.classList.add("notactive");
  outPage.classList.add("appear");
  textArea.value = arrayOfNotes[id];
  textArea.focus();
}

// إلغاء التعديل
function cancelUpdate() {
  main.classList.remove("notactive");
  header.classList.remove("notactive");
  outPage.classList.remove("appear");
}

// تحديث الملاحظة
btn.addEventListener("click", update);
textArea.oninput = function () {
  msg.style.display = "none";
};
async function update(e) {
  e.preventDefault();
  if (textArea.value.trim() === "") {
    msg.innerHTML = "Please Write Your Note";
    msg.style.backgroundColor = "red";
    msg.style.color = "white";
    msg.style.padding = "10px";
    msg.style.borderRadius = "5px";
    msg.style.display = "block";
    msg.style.marginBottom = "20px";
  } else {
    let data = await sendDataForChecking(textArea.value);
    moveNotesOfUserForArray();
    arrayOfNotes[idOfUpdate] = data;
    localStorage.setItem("data" + idOfUser, JSON.stringify(arrayOfNotes));
    showNotes();
    main.classList.remove("notactive");
    header.classList.remove("notactive");
    outPage.classList.remove("appear");
  }
}

// حذف ملاحظة
function deleteNote(id) {
  arrayOfNotes.splice(id, 1);
  localStorage.setItem("data" + idOfUser, JSON.stringify(arrayOfNotes));
  showNotes();
}

// حذف جميع الملاحظات
function deleteAll() {
  if (confirm("You Will Delete All Notes")) {
    arrayOfNotes = [];
    localStorage.setItem("data" + idOfUser, JSON.stringify(arrayOfNotes));
    showNotes();
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// إرسال البيانات للتحقق
async function sendDataForChecking(dataBase) {
  try {
    let response = await fetch("index.php", {
      method: "POST",
      body: JSON.stringify({
        note: dataBase
      }),
      headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    return data["note"];
  } catch (error) {
    throw error;
  }
}
function updateClock() {
  let now = new Date();

  // الحصول على الوقت
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let timeString = `${hours}:${minutes}`;

  // الحصول على التاريخ
  let day = now.getDate().toString().padStart(2, "0");
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); // الأشهر تبدأ من 0
  let year = now.getFullYear();
  let dateString = `${day}-${month}-${year}`;
  return `📅 ${dateString} ${timeString}`;
}
