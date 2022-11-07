/**
 * @author: 김상현
 * @date: 2022-11-06
 * @detail: 카카오를 통한 첫 로그인 시도 시 회원가입을 위한 추가 정보 입력 페이지
 */
import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector("#fullNameInput");
const postCodeInput = document.querySelector("#postCodeInput");
const addressInput = document.querySelector("#addressInput");
const submitButton = document.querySelector("#submitButton");
const postCodeSearchButton = document.querySelector("#postCodeSearchButton");
const detailAddressInput = document.querySelector("#detailAddressInput");

isUserRedirect();
addAllElements();
addAllEvents();

// 가입 이력이 있는 카카오 로그인이면 바로 홈으로 리다이렉트
async function isUserRedirect() {
  try {
    const email = localStorage.getItem("email");
    const { isExist } = await Api.get(`/api/email/${email}`);
    if (isExist) {
      window.location.href = "/";
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  postCodeSearchButton.addEventListener("click", handleDaumPost);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const postCode = postCodeInput.value;
  let address = addressInput.value;
  let detailAddress = detailAddressInput.value || "";

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isPostCodeValid = postCode.length === 5;
  const isAddressValid = address.length >= 2;

  if (!isFullNameValid) {
    return alert("이름은 2글자 이상이어야 합니다.");
  }

  if (!isPostCodeValid) {
    return alert("우편번호는 숫자 5자리를 입력해 주세요.");
  }

  if (!isAddressValid) {
    return alert("올바른 주소를 입력해주세요.");
  }

  // 주소와 상세주소를 합침
  address = address + " " + detailAddress;

  // 회원가입 api 요청
  try {
    const email = localStorage.getItem("email");
    const data = { fullName, email, postCode, address };

    await Api.post("/api/register-kakao", data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = "/";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function handleEmailCheck(e) {
  e.preventDefault();
  try {
    const email = emailInput.value;
    const { isExist } = await Api.get(`/api/email/${email}`);
    if (isExist) {
      emailInput.value = "";
      return alert("중복된 이메일입니다.");
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
  alert("사용 가능한 이메일입니다.");
}

function handleDaumPost(e) {
  new daum.Postcode({
    oncomplete: function (data) {
      let address = "";

      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소 클릭
        address = data.roadAddress;
      } else {
        // 사용자가 지번 주소 클릭
        address = data.jibunAddress;
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      postCodeInput.value = data.zonecode;
      addressInput.value = address;
      // 커서를 상세주소 필드로 이동한다.
      detailAddressInput.focus();
    },
  }).open();
}
