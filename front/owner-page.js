
if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';

  getSelf(function (response) {
    if (response.userType !== 1) {
      window.location.replace('/index.html');
    }
    if (response.userType === 1) {
      document.getElementById('applyServicePage').href = 'owner-services.html';
      document.getElementById('getServicePage').href = 'owner-page.html';
    }
  });
} else {
  document.getElementsByClassName('logout-btn')[0].style.display = 'none';
  document.getElementsByClassName('logout-btn')[1].style.display = 'none';
  document.getElementsByClassName('logout-btn')[2].style.display = 'none';
  document.getElementsByClassName('logout-btn')[3].style.display = 'none';
}

// 페이지 로딩 완료 시
$(document).ready(function () {
  showService();
});

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

// 모달창
const myModal = new bootstrap.Modal('#alertModal');
function customAlert(text) {
  document.getElementById('modal-text').innerHTML = text;
  myModal.show();
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
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
      }
      window.location.href = '/';
    });
}

// GET - 서비스 하나 조회(사장님)
function showService() {
  // const serviceId = 1 // '현재 서비스 중'인 서비스를 어떻게 얻어올 수 있을까?
  axios
    .get('api/services/owner/mypage', {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      console.log(response);
      const data = response.data.data;
      let status = data.status;

      $('#service-id').text(`${data.serviceId}번 세탁물`);
      $('#service-id').attr('data-service-id', data.serviceId);
      $('#customer-nickname').val(data.customerNickname);
      // $('#image').text(data.image);
      $('#customer-phone-number').val(data.customerPhoneNumber);
      $('#customer-address').val(data.customerAddress);
      $('#customer-request').val(data.customerRequest);

      if (status === '대기 중') {
        status = 1;
        // '2'클릭 가능
        $('#bullet2').attr('onclick', `modifyService('수거 중')`);
      } else if (status === '수거 중') {
        status = 2;
        $('#bullet3').attr('onclick', `modifyService('수거 완료')`);
      } else if (status === '수거 완료') {
        status = 3;
        $('#bullet4').attr('onclick', `modifyService('배송 중')`);
      } else if (status === '배송 중') {
        status = 4;
        $('#bullet5').attr('onclick', `modifyService('배송 완료')`);
        updatePoint()
      } else if (status === '배송 완료') {
        status = 5;
      }
      for (j = 0; j < status; j++) {
        document.getElementById(`span${j + 1}`).innerHTML = '✓';
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 404) {
        // $('.message').text('현재 진행중인 세탁 서비스가 없습니다.');
        $('#jongki').text(error.response.data.errorMessage);
        $('.form-outer').hide();
      } else {
        customAlert(error.response.data.errorMessage);
      }
    });
}

// PUT - 포인트 업데이트(사장님 +10000)
function updatePoint() {
  $.ajax({
    type: 'PUT',
    url: '/api/users/point',
    data: JSON.stringify({ point: 10000 }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      // await customAlert('10,000 포인트를 획득하였습니다.');
      alert('10,000 포인트를 획득하였습니다.') // 모달창도, alert창도 뜨질 않음. 10000포인트는 잘 들어감을 확인.
      // location.reload();
    },
    error: function (xhr) {
      customAlert(xhr.responseJSON.errorMessage);
    },
  })
}

// PUT - 서비스 수정(사장님 마이페이지에서)
function modifyService(status) {
  const checkConfirm = confirm(
    `해당 서비스를 '${status}'으로 업데이트하시겠습니까?`
  );
  if (!checkConfirm) {
    return;
  }
  const serviceId = $('#service-id').attr('data-service-id');
  $.ajax({
    type: 'PUT',
    url: `/api/services/${serviceId}/mypage`,
    data: JSON.stringify({ status: status }),
    contentType: 'application/json; charset=UTF-8',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: async function (response) {
      await customAlert(response.message);
      location.reload();
    },
    error: function (xhr) {
      // console.log(xhr.responseJSON.errorMessage);
      customAlert(xhr.responseJSON.errorMessage);
    },
  });
}
