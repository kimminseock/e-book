// 탭을 전환하는 함수
function showTab(index) {
    // 모든 탭 콘텐츠 요소들을 선택
    const tabs = document.querySelectorAll('.tab-content');
    // 탭 버튼 요소들을 선택
    const buttons = document.querySelectorAll('.tabs button');

    // 모든 탭 콘텐츠에서 'active' 클래스 제거
    tabs.forEach(tab => tab.classList.remove('active'));

    // 모든 버튼에서 'active' 클래스 제거
    buttons.forEach(btn => btn.classList.remove('active'));

    // 선택된 인덱스의 탭 콘텐츠에 'active' 클래스 추가
    tabs[index].classList.add('active');

    // 선택된 인덱스의 버튼에 'active' 클래스 추가
    buttons[index].classList.add('active');
}

// 리뷰(댓글)를 추가하는 함수
function addReview(event) {
    // 폼 전송 기본 동작(페이지 새로고침) 막기
    event.preventDefault();

    // 이름 입력 필드 가져오기
    const nameInput = document.getElementById('name-input');
    // 텍스트 입력 필드 가져오기
    const textInput = document.getElementById('todo-input');

    // 이름과 텍스트 값 추출하고 공백 제거
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    // 이름 또는 텍스트가 비어있으면 함수 종료
    if (!name || !text) return;

    // 현재 저장된 리뷰 리스트 가져오기
    const reviews = getReviews();

    // 현재 날짜 객체 생성
    const now = new Date();
    // 날짜를 YYYY-MM-DD 형식으로 변환
    const date = now.toISOString().split('T')[0];

    // 새로운 리뷰를 배열 맨 앞에 추가
    reviews.unshift({ name, text, date });

    // localStorage에 리뷰 리스트를 JSON 문자열로 저장
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // 입력 필드 초기화
    nameInput.value = '';
    textInput.value = '';

    // 리뷰 리스트 다시 렌더링
    renderReviews();
}

// 특정 리뷰를 삭제하는 함수
function deleteReview(index) {
    // 현재 저장된 리뷰 리스트 가져오기
    const reviews = getReviews();

    // 해당 인덱스의 리뷰를 배열에서 제거
    reviews.splice(index, 1);

    // 수정된 리뷰 리스트를 localStorage에 저장
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // 리뷰 리스트 다시 렌더링
    renderReviews();
}

// localStorage에서 리뷰 리스트를 가져오는 함수
function getReviews() {
    // localStorage에 저장된 'reviews' 키 값(JSON 문자열)을 객체로 파싱
    // 저장된 값이 없으면 빈 배열 반환
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

// 리뷰들을 화면에 출력하는 함수
function renderReviews() {
    // 리뷰 리스트가 표시될 요소 가져오기
    const list = document.getElementById('todo-list');

    // 기존 리스트 초기화
    list.innerHTML = '';

    // 저장된 리뷰들을 반복하여 화면에 추가
    getReviews().forEach((review, index) => {
        // article 요소 생성
        const article = document.createElement('article');
        // 클래스 이름 지정
        article.className = 'review';

        // 리뷰 내용을 HTML 형식으로 삽입 (삭제 버튼 포함)
        article.innerHTML = `<strong>${review.name}</strong> (${review.date})<br>${review.text} <button onclick="deleteReview(${index})">삭제</button>`;

        // 리스트에 리뷰 항목 추가
        list.appendChild(article);
    });
}

// 페이지가 로드될 때 저장된 리뷰들을 렌더링
document.addEventListener('DOMContentLoaded', renderReviews);
