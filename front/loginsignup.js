if (localStorage.getItem('token')) {
    window.location.replace('/index.html');
}

document.getElementsByClassName('login-btn')[0].style.display = 'none';
document.getElementsByClassName('logout-btn')[0].style.display = 'none';
document.getElementsByClassName('logout-btn')[1].style.display = 'none';
document.getElementsByClassName('logout-btn')[2].style.display = 'none';
document.getElementsByClassName('logout-btn')[3].style.display = 'none';
document.getElementsByClassName('logout-btn')[4].style.display = 'none';

const container = document.querySelector('.container'),
  pwShowHide = document.querySelectorAll('.showHidePw'),
  pwFields = document.querySelectorAll('.password'),
  signUp = document.querySelectorAll('.signup-link'),
  login = document.querySelectorAll('.login-link');

//비밀번호 가리기/보이기 + 아이콘 바뀌기
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener('click', () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === 'password') {
        pwField.type = 'text';

        pwShowHide.forEach((icon) => {
          icon.classList.replace('uil-eye-slash', 'uil-eye');
        });
      } else {
        pwField.type = 'password';

        pwShowHide.forEach((icon) => {
          icon.classList.replace('uil-eye', 'uil-eye-slash');
        });
      }
    });
  });
});

// // 회원가입, 로그인 폼 클릭하면 나오게 하기
$(document).on('click', '#signupform', function () {
  container.classList.add('active');
});
$(document).on('click', '#loginform', function () {
  container.classList.remove('active');
});

// 사장/고객 선택 버튼 작동
var selectField = document.getElementById('selectField');
var selectText = document.getElementById('selectText');
var options = document.getElementsByClassName('options');
var list = document.getElementById('list');
var arrowIcon = document.getElementById('arrowIcon');

// 선택하면 선택지 숨겨지게 하기
selectField.onclick = function () {
  list.classList.toggle('hide');
  // 클릭하면 화살표 방향 바뀌게 하기
  arrowIcon.classList.toggle('rotate');
};

for (option of options) {
  option.onclick = function () {
    selectText.innerHTML = this.textContent;
    list.classList.toggle('hide');
    // 클릭하면 화살표 방향 바뀌게 하기
    arrowIcon.classList.toggle('rotate');
  };
}

// 회원가입
function sign_up() {
  const nickname = document.getElementById('inputNickname').value;
  const password = document.getElementById('inputPassword').value;
  const confirm = document.getElementById('inputConfirm').value;
  const phoneNumber = document.getElementById('inputPhoneNumber').value;
  const address = document.getElementById('inputAddress').value;
  const userTypeInput = document.getElementById('selectText').innerText;

  let userType = 2;
  if (userTypeInput === '고객님') {
    userType = 0;
  } else if (userTypeInput === '사장님') {
    userType = 1;
  }

  axios
    .post('api/users/signup', {
      nickname: nickname,
      password: password,
      confirm: confirm,
      phoneNumber: phoneNumber,
      address: address,
      userType: userType,
    })
    .then((response) => {
      customAlert('회원가입을 축하드립니다!', function () {
        window.location.replace('/loginsignup.html');
      });
    })
    .catch((error) => {
      customAlert2(error.response.data.errorMessage);
    });
}

// 로그인
function sign_in() {
  let nickname = document.getElementById('loginNickname').value;
  let password = document.getElementById('loginPassword').value;
  axios
    .post('api/users/login', {
      nickname: nickname,
      password: password,
    })
    .then((response) => {
      localStorage.setItem('token', response.data.token);
      window.location.replace('/');
    })
    .catch((error) => {
      customAlert2(error.response.data.errorMessage);
    });
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text, confirmCallback) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
  if (confirmCallback) {
    $('#alertModal .btn-confirm').click(confirmCallback);
  }
}

// 모달창2 - 확인 버튼만 있는 것.
const myModal2 = new bootstrap.Modal('#alertModal2');
function customAlert2(text) {
  document.getElementById('modal-text2').innerHTML = text;
  myModal2.show();
}
