// 페이지 로딩 완료 시
$(document).ready(function () {
  getUser();
});

// 로그인/로그아웃 버튼
if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
  getSelf(function (response) {
    console.log(response)
    if (response.userType === 1) {
      document.getElementById('applyServicePage').href = 'owner-services.html';
      document.getElementById('getServicePage').href = 'owner-page.html';
    } else {
      document.getElementsByClassName('logout-btn')[3].style.display = 'none';
    }
  });
} else {
  window.location.replace('/index.html');
}

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
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
        alert('로그인이 필요합니다.');
      } else {
        // localStorage.clear();
        console.log(error);
        alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    });
}

// GET - 회원 정보 조회 - 완료
function getUser() {
  $.ajax({
    type: 'GET',
    url: '/api/users/',
    data: {},
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      const data = response.data;
      $('#user-nickname').val(data.nickname);
      $('#user-phone-number').val(data.phoneNumber);
      $('#user-address').val(data.address);
      $('#user-point').val(data.point);
    },
    error: function (xhr, status, error) {
      if (status === 401) {
        customAlert2('로그인이 필요합니다');
      } else {
        // localStorage.clear();
        customAlert2(error.responseJSON.errorMessage);
      }
      window.location.href = '/';
      // window.location.replace('/'); // 둘이 다른 점??
    },
  });
}

// PUT - 회원 정보 수정 - 인풋값 받아오기 진행중
function modifyUser() {
  const phoneNumber = $('#user-phone-number').val();
  const address = $('#user-address').val();
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
      customAlert2(response.message);
    },
    error: function (xhr) {
      // console.log(xhr.responseJSON.errorMessage);
      customAlert2(xhr.responseJSON.errorMessage);
    },
  });
}

// DELETE - 회원 정보 삭제 - 확인 메세지 창 진행중
function deleteUser() {
  const check = confirm(
    '정말 탈퇴하시겠습니까? 이용하신 서비스 정보가 모두 삭제되고 복구 불가능합니다.'
  );
  if (check) {
    const confirmPassword = prompt('비밀번호를 입력해주세요');

    getSelf(function (response) {
      console.log('user data: ', response);
      if (confirmPassword !== response.password) {
        customAlert2('비밀번호 확인에 실패하였습니다.');
        // return "비번 확인 실패";
      } else {
        // 삭제 진행
        $.ajax({
          type: 'DELETE',
          url: `/api/users`,
          data: {},
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          success: function (response) {
            customAlert2(response.message);
            logout();
          },
          error: function (xhr) {
            customAlert2(xhr.responseJSON.errorMessage);
          },
        });
      }
    });
  }
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text) {
  // const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
}

// 모달창2 - 확인 버튼만 있는 것.
const myModal2 = new bootstrap.Modal('#alertModal2');
function customAlert2(text) {
  document.getElementById('modal-text2').innerHTML = text;
  myModal2.show();
}
