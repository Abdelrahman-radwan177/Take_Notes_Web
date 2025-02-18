// تعريف العناصر
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let CreateAcountButton = document.getElementById("CreateButton");
let createEmail = document.getElementById("createEmail");
let createPassword = document.getElementById("createPassword");

let formOfSingUp = document.getElementById("sinUp");
let errorMessageOfCreate = document.getElementById("errorOfSinIn");

// تعريف المتغيرات
let arrayOfUsers = [];

// تحميل البيانات من localStorage
moveDataForArray();

// تحميل بيانات المستخدمين
function moveDataForArray() {
  if (localStorage.getItem("users") !== null) {
    arrayOfUsers = JSON.parse(localStorage.getItem("users"));
  }
}

// تسجيل مستخدم جديد
formOfSingUp.addEventListener("submit", async function (event) {
  event.preventDefault();
  moveDataForArray();

  // التحقق من عدم تسجيل البريد الإلكتروني مسبقاً
  if (arrayOfUsers.some((user) => user.email === createEmail.value)) {
    alert("Email Has Been Registered Before");
    return;
  }

  // إرسال البيانات للتحقق والتشفير
  try {
    let data = await sendDataForHashing();
    if (
      data &&
      data.email &&
      data.password &&
      data.firstName &&
      data.lastName
    ) {
      let newUser = {
        email: data["email"],
        password: data["password"],
        firstName: data["firstName"],
        lastName: data["lastName"]
      };
      arrayOfUsers.push(newUser);
      saveInLocalstorage();
      createEmail.value = "";
      createPassword.value = "";
      firstName.value = "";
      lastName.value = "";
      alert("Registration Successful!");
      window.location = "./login.html";
    } else {
      alert("Invalid data received from server.");
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
  }
});

// حفظ البيانات في localStorage
function saveInLocalstorage() {
  localStorage.setItem("users", JSON.stringify(arrayOfUsers));
}

// إرسال البيانات للتحقق والتشفير
async function sendDataForHashing() {
  try {
    let response = await fetch("index.php", {
      method: "POST",
      body: JSON.stringify({
        password: createPassword.value,
        email: createEmail.value,
        firstName: firstName.value,
        lastName: lastName.value
      }),
      headers: { "Content-Type": "application/json" }
    });

    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
