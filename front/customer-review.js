if (localStorage.getItem('token')) {
  getSelf(function (response) {
    if (response.userType !== 0) {
      window.location.replace('/index.html');
    }
    document.getElementsByClassName('logout-btn')[3].style.display = 'none';
    getReview();
    getReviewAll();
  });
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
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

const btn = document.querySelector('button');
const post = document.querySelector('.post');
const widget = document.querySelector('.star-widget');
const editBtn = document.querySelector('.edit');
btn.onclick = () => {
  // widget.style.display = 'none';
  // post.style.display = 'block';
};

// 리뷰 작성
let rate = 0;
document.getElementById('star1').addEventListener('click', function () {
  rate = 1;
});
document.getElementById('star2').addEventListener('click', function () {
  rate = 2;
});
document.getElementById('star3').addEventListener('click', function () {
  rate = 3;
});
document.getElementById('star4').addEventListener('click', function () {
  rate = 4;
});
document.getElementById('star5').addEventListener('click', function () {
  rate = 5;
});

function applyReview() {
  const title = document.getElementById('review-title').value;
  const content = document.getElementById('review-content').value;
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );

  axios
    .post(
      'api/reviews/create',
      {
        title: title,
        content: content,
        rate: rate,
        serviceId: serviceId,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      window.location.replace(`customer-review.html?serviceId=${serviceId}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

// 해당 서비스 리뷰 조회
function getReview() {
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );
  axios
    .get(`api/reviews/customer/${serviceId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data;
      document.getElementById('btn').style.display = 'none';
      document.getElementById('modify-btn').style.display = 'block';
      document.getElementById('main-title').innerHTML = '작성된 리뷰입니다';
      document.getElementById('review-title').value = data.title;
      document.getElementById('review-content').value = data.content;
      document.getElementById(`star${data.rate}`).click();
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}

// 리뷰 수정
function updateReview() {
  const title = document.getElementById('review-title').value;
  const content = document.getElementById('review-content').value;
  const serviceId = new URLSearchParams(window.location.search).get(
    'serviceId'
  );
  axios
    .put(
      `api/reviews/customer/${serviceId}`,
      {
        title: title,
        content: content,
        rate: rate,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    .then((response) => {
      window.location.replace(`customer-review.html?serviceId=${serviceId}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

// 리뷰 전체 조회
function getReviewAll() {
  axios
    .get(`api/reviews/customer`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data;
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const temp = document.createElement('div');
        temp.setAttribute('class', 'testimonial-box');
        temp.innerHTML = `
        <div class="box-top">
            <div class="profile">
                <div class="name-user">
                    <strong>${data[i].nickname}</strong>
                </div>
            </div>
  
            <div id="test" class="reviews">
                <i id="review${i}-star1" class="fa-regular fa-star"></i>
                <i id="review${i}-star2" class="fa-regular fa-star"></i>
                <i id="review${i}-star3" class="fa-regular fa-star"></i>
                <i id="review${i}-star4" class="fa-regular fa-star"></i>
                <i id="review${i}-star5" class="fa-regular fa-star"></i>
            </div>
        </div>
  
        <div class="client-comment">
            <p>${data[i].content}</p>
        </div>

        <div class="field">
        <button class="firstNext next" onclick="location.href='customer-review.html?serviceId=${data[i].serviceId}'">수정</button>
        </div>`;
        document.getElementById('testimonial-box-container').append(temp);

        for (let j = 0; j < data[i].rate; j++) {
          let star = document.getElementById(`review${i}-star${j + 1}`);
          star.classList.replace('fa-regular', 'fa-solid');
        }
      }
    })
    .catch((error) => {
      console.log(error);
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
      window.location.href = '/index.html';
    });
}
