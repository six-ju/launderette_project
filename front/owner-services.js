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

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/index.html';
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

getService();
// 손님 서비스 조회
function getService() {
  axios
    .get(`api/services/customer/pending`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data;
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const temp = document.createElement('div');
        temp.setAttribute('class', 'container');
        temp.innerHTML = `
        <div class="box">
          <header>주문 #${data.length - i}</header>
          <div class="progress-bar">
            <div class="step">
              <p>대기 중</p>
              <div class="bullet">
                <span id="span${i}-1">1</span>
              </div>
            </div>
            <div class="step">
              <p>수거 중</p>
              <div class="bullet">
                <span id="span${i}-2">2</span>
              </div>
            </div>
            <div class="step">
              <p>수거 완료</p>
              <div class="bullet">
                <span id="span${i}-3">3</span>
              </div>
            </div>
            <div class="step">
              <p>배송 중</p>
              <div class="bullet">
                <span id="span${i}-4">4</span>
              </div>
            </div>
            <div class="step">
              <p>배송 완료</p>
              <div class="bullet">
                <span id="span${i}-5">5</span>
              </div>
            </div>
          </div>
          <div class="form-outer">
            <form action="#">
              <div class="page slide-page">
                <div class="title">${data[i].customerNickname} 고객님의 주문</div>
                <div class="field">
                  <div class="label">서비스 신청 일시</div>
                  <input type="text" placeholder="날짜: ${data[i].createdAt
                    .split('.')[0]
                    .split('T')
                    .join('  시간: ')}" readonly />
                </div>
                <div class="field">
                  <div class="label">전화번호</div>
                  <input type="text" placeholder="${
                    data[i].customerPhoneNumber
                  }" readonly />
                </div>
                <div class="field">
                  <div class="label">주소</div>
                  <input type="text" placeholder="${
                    data[i].customerAddress
                  }" readonly />
                </div>
                <div class="field">
                  <div class="label">요청사항</div>
                  <input type="text" placeholder="${
                    data[i].customerRequest
                  }" readonly />
                </div>
                <button type="button" class="btn btn-primary" onclick="doService(${
                  data[i].serviceId
                })">서비스 진행하기</button>
              </div>
            </form>
          </div>
        </div>`;
        document.getElementById('container-list').append(temp);

        let status = data[i].status;
        if (status === '대기 중') {
          status = 1;
        } else if (status === '수거 중') {
          status = 2;
        } else if (status === '수거 완료') {
          status = 3;
        } else if (status === '배송 중') {
          status = 4;
        } else if (status === '배송 완료') {
          status = 5;
          document
            .getElementById(`review${i}`)
            .classList.replace('hide', 'show');
        }
        for (j = 0; j < status; j++) {
          document.getElementById(`span${i}-${j + 1}`).innerHTML = '✓';
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// 서비스 진행하기
function doService(serviceId) {
  console.log(serviceId);
  axios
    .put(
      `api/services/pickup/${serviceId}`,
      { serviceId },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      window.location.replace('/owner-page.html');
    })
    .catch((error) => {
      console.log(error);
      customAlert2(error.response.data.errorMessage);
    });
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
