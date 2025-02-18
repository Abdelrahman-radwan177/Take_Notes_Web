// تعريف العناصر
let formOfSinIn = document.getElementById("logIn");
let logINEmail = document.getElementById("logINEmail");
let logINPassword = document.getElementById("logINPassword");

// تعريف المتغيرات
let idOfUser = null;
let arrayOfUsers = [];

// تحميل البيانات من localStorage
moveDataForArray();
sessionOfUser();

// تحميل بيانات المستخدمين
function moveDataForArray() {
  if (localStorage.getItem("users") !== null) {
    arrayOfUsers = JSON.parse(localStorage.getItem("users"));
  }
}

// تسجيل الدخول
formOfSinIn.addEventListener("submit", async function (event) {
  event.preventDefault();
  moveDataForArray();
  idOfUser = null;

  // البحث عن المستخدم باستخدام البريد الإلكتروني
  for (let i = 0; i < arrayOfUsers.length; i++) {
    if (arrayOfUsers[i].email == logINEmail.value) {
      idOfUser = i;
      break;
    }
  }

  // التحقق من وجود المستخدم
  if (idOfUser === null) {
    alert("Email Has Not Been Registered Before");
    return;
  }

  // التحقق من صحة كلمة المرور
  try {
    let testing = await sendDataForCheckingHashing();
    if (testing === "true") {
      logINEmail.value = "";
      logINPassword.value = "";
      localStorage.setItem("id", JSON.stringify(idOfUser));
      alert("Login Successful!");
      sessionOfUser();
    } else {
      logINPassword.value = "";
      alert("Email Or Password Is Wrong");
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
  }
});

// إرسال البيانات للتحقق من كلمة المرور
async function sendDataForCheckingHashing() {
  try {
    let response = await fetch("index.php", {
      method: "POST",
      body: JSON.stringify({
        enteredPassword: logINPassword.value,
        savedPassword: arrayOfUsers[idOfUser].password
      }),
      headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    return data["test"];
  } catch (error) {
    throw error;
  }
}

// التحقق من جلسة المستخدم
function sessionOfUser() {
  if (JSON.parse(localStorage.getItem("id")) !== null) {
    window.location = "./profile.html";
  }
}