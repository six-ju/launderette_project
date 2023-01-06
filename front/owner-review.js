if (localStorage.getItem('token')) {
  document.getElementsByClassName('login-btn')[0].style.display = 'none';
} else {
  document.getElementsByClassName('logout-btn')[0].style.display = 'none';
  document.getElementsByClassName('logout-btn')[1].style.display = 'none';
}

getReview();

// 로그아웃
function logout() {
  localStorage.clear();
  window.location.href = '/';
}

// 사장님 리뷰 조회
function getReview() {
  let userId = new URLSearchParams(window.location.search).get('userId');
  if (!userId) {
    userId = 'none'
  }
  axios
    .get(`api/reviews/owner/${userId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((response) => {
      const { data } = response.data;

      for (let i = 0; i < data.length; i++) {
        const temp = document.createElement('div');
        temp.setAttribute('class', 'testimonial-box');
        temp.innerHTML = `
        <div class="box-top">
            <div class="profile">
                <div class="name-user">
                    <strong>${data[i].customerNickname}</strong>
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
        </div>`;
        document.getElementById('testimonial-box-container').append(temp);

        for (let j = 0; j < data[i].rate; j++) {
          console.log(i, j);
          console.log(document.getElementById(`review${i}-star${j + 1}`));
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
      window.location.href = '/';
    });
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
