/**
 * @author: 김상현
 * @detail: 마이페이지를 위한 js파일입니다.
 */

import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const userAdmin = document.querySelector("#user-admin");
const userName = document.querySelector("#user-name");
const userNameButton = document.querySelector("#user-name-button");
const userEmail = document.querySelector("#user-email");
const userPasswordButton = document.querySelector("#user-password-button");
const userAddress = document.querySelector("#user-address");
const userAddressButton = document.querySelector("#user-address-button");
const userWithdrawButton = document.querySelector("#user-widthdraw-button");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertIsAdmin();
  insertUserName();
  insertUserEmail();
  insertUserAddress();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  userNameButton.addEventListener("click", changeNameHandler);
  userPasswordButton.addEventListener("click", changePasswordHandler);
  userAddressButton.addEventListener("click", changeAddressHandler);
}

// admin 유저일 경우 이름 위에 관리자 표시
function insertIsAdmin() {
  if (localStorage.getItem("isAdmin") === "true") {
    userAdmin.style.removeProperty("display");
  } else if (localStorage.getItem("isAdmin") === "false") {
    userAdmin.style.display = "none";
  }
}

async function insertUserName() {
  try {
    const email = localStorage.getItem("email");
    const user = await Api.get(`/api/email/${email}`);
    const { fullName } = user;
    userName.innerText = fullName;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function insertUserEmail() {
  const email = localStorage.getItem("email");
  userEmail.innerText = email;
}

async function insertUserAddress() {
  try {
    const email = localStorage.getItem("email");
    const user = await Api.get(`/api/email/${email}`);
    const { address } = user;
    userAddress.innerText = address;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 유저 이름 변경
async function changeNameHandler(e) {
  const email = localStorage.getItem("email");
  const fullName = prompt("변경할 이름을 입력하세요.");
  const isFullNameValid = fullName.length >= 2;
  if (!isFullNameValid) {
    return alert("이름은 2글자 이상이어야 합니다.");
  }
  try {
    const data = { fullName, email };
    const user = await Api.patch("/api/user", "fullName", data);
    const updatedFullName = user.fullName;
    userName.innerText = updatedFullName;
    alert(`이름이 ${updatedFullName}으로 변경되었습니다.`);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 유저 패스워드 변경
async function changePasswordHandler(e) {
  try {
    const email = localStorage.getItem("email");
    const currentPassword = prompt("현재 비밀번호를 입력하세요.");
    const newPassword = prompt("새로운 비밀번호를 입력하세요.");
    const data = { currentPassword, newPassword, email };
    const user = await Api.patch("/api/user", "password", data);
    alert("비밀번호가 성공적으로 변경되었습니다.");
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 유저 주소 변경
async function changeAddressHandler(e) {
  const email = localStorage.getItem("email");
  const address = prompt("변경할 주소를 입력하세요.");
  // const isPostCodeValid = postCode.length === 5;
  const isAddressValid = address.length >= 2;
  // if (!isPostCodeValid) {
  //   return alert("우편번호는 숫자 5자리를 입력해 주세요.");
  // }
  if (!isAddressValid) {
    return alert("올바른 주소를 입력해주세요.");
  }
  try {
    const data = { address, email };
    const user = await Api.patch("/api/user", "address", data);
    const updatedAddress = user.address;
    userAddress.innerText = updatedAddress;
    alert(`이름이 ${updatedAddress}으로 변경되었습니다.`);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
