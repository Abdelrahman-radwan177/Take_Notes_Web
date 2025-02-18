<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Content-Type: application/json");

// استقبال البيانات من JavaScript
$data = json_decode(file_get_contents("php://input"), true);

// التحقق من وجود البيانات
if (isset($data['password'],$data['email'],$data['firstName'], $data['lastName'] )) {
    // error_log("pass is " . $password);  //عشان اقدر اعرف هل الباسورد تم استلامه ولا لا وهيظهر في ملف ال errorlogs اللي في السيرفر
    $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
    $data["email"]=filter_var($data['email'],FILTER_VALIDATE_EMAIL);
    $data['firstName'] = filter_var($data['firstName'], FILTER_SANITIZE_SPECIAL_CHARS);
    $data['lastName'] = filter_var($data['lastName'], FILTER_SANITIZE_SPECIAL_CHARS);

    // رد JSON إلى JavaScript
    if ($data["email"] === false) {
        echo json_encode(["error" => "Invalid email"]);
        exit;
    }
     echo json_encode([
        "password" => $data["password"],
        "email" => $data["email"],
        "firstName" => $data["firstName"],
        "lastName" => $data["lastName"],
    ]);
}
elseif (isset($data["enteredPassword"]) && isset($data["savedPassword"])) {
    if (password_verify($data["enteredPassword"], $data["savedPassword"])) {
        echo json_encode(["test" => "true"]);
    } else {
        echo json_encode(["test" => "false"]);
    }
} else if(isset($data['note'])){
    $data['note'] = filter_var($data['note'], FILTER_SANITIZE_SPECIAL_CHARS);
    echo json_encode([
        "note" => $data["note"],
    ]);
}
else {
    echo json_encode(["error" => "Invalid data"]);
}

?>
