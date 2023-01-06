// const { default: axios } = require('axios');

if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
  getSelf(function (response) {
    if (response.userType !== 0) {
      window.location.replace('/index.html');
    }
    document.getElementById('inputNickname').value = response.nickname;
    document.getElementById('inputPhoneNumber').value = response.phoneNumber;
    document.getElementById('inputAddress').value = response.address;
    document.getElementsByClassName('logout-btn')[3].style.display = 'none';
  });
} else {
  window.location.replace('/index.html');
}

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
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

// 사용자 정보 조회
function getSelf(callback) {
  axios
    .get('api/users/me', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      callback(response.data.user);
    })
    .catch((error) => {
      if (status == 401) {
        customAlert2('로그인이 필요합니다.');
      } else {
        // localStorage.clear();
        customAlert2('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    });
}

// 회원 정보 수정
function modifyUser(phoneNumber, address) {
  $.ajax({
    type: 'PUT',
    url: `/api/users`,
    data: JSON.stringify({
      phoneNumber: phoneNumber,
      address: address,
      // password: password,
      // confirm: confirm
    }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      console.log('modify success response: ', response);
      customAlert2('회원 정보 수정을 완료했습니다. 다시 등록을 진행해주세요');
    },
    error: function (xhr) {
      console.log('modify failuser meessage: ', xhr.responseJSON.errorMessage);
      customAlert2(xhr.responseJSON.errorMessage);
    },
  });
}

// 서비스 신청
function applyService() {
  const phoneNumber = document.getElementById('inputPhoneNumber').value;
  const address = document.getElementById('inputAddress').value;
  const imageSrc = document.getElementById('image').src;
  const image = imageSrc || ' ';
  // const image = `./uploadImages/${imageSrc.name}`;
  const customerRequest = document.getElementById('inputCustomerRequest').value;

  getSelf(function (response) {
    if (phoneNumber !== response.phoneNumber || address !== response.address) {
      // 유저 정보 수정
      modifyUser(phoneNumber, address);
      // customAlert2( // 이게 왜 안뜨지..
      //     '입력하신 정보로 회원 정보가 업데이트 되었습니다.'
      //   // '입력하신 정보로 회원 정보를 업데이트한 후 계속 진행하실 수 있습니다. 해당 주소와 전화 번호로 회원 정보를 업데이트 하시겠습니까?'
      // );
      // return;
    } else {
      // 모달창이 두번 연속으로는 안 떠서 굳이 따로 작동하게 만듬.
      axios
        .post(
          'api/services',
          {
            image: image,
            customerRequest: customerRequest,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          customAlert2(response.data.message);
        })
        .catch((error) => {
          customAlert2(error.response.data.errorMessage);
        });

      axios
        .put(
          'api/users/point',
          { point: -10000 },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          customAlert2(response.data.message);
        })
        .catch((error) => {
          customAlert2(error.response.data.errorMessage);
        });
    }
  });
}

let imageSrc = '';

function loadFile(input) {
  // imageSrc = input.files[0];

  let file = input.files[0];

  let newImage = document.getElementById('image');
  newImage.src = URL.createObjectURL(file);

  newImage.style.width = '100%';
  newImage.style.height = '100%';
  newImage.style.objectFit = 'contain';
}
