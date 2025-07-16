// PDF 샘플 파일의 URL (Mozilla 제공 데모 PDF 파일)
const url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

// PDF.js가 내부에서 사용하는 워커(worker) 스크립트 경로 설정
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ===== 전역 변수 선언 ===== //
let pdfDoc = null;                         // 불러온 PDF 문서 객체 저장
let currentPage = 1;                       // 현재 보여지는 페이지 번호 (초기값 1)
let totalPages = 0;                        // 전체 페이지 수
const canvas = document.getElementById('pdf-canvas'); // PDF를 렌더링할 캔버스 요소 선택
const ctx = canvas.getContext('2d');       // 캔버스에서 2D 그래픽을 그리기 위한 컨텍스트 객체 생성

/**
 * PDF 페이지를 렌더링하는 함수
 * @param {number} num - 렌더링할 페이지 번호
 * @param {string} direction - 넘김 애니메이션 방향 ('next', 'prev', 'none')
 */
function renderPage(num, direction = 'none') {
    // PDF 문서에서 지정된 페이지 번호의 페이지 가져오기
    pdfDoc.getPage(num).then(page => {

        // 뷰어 너비에 맞춰 스케일 조정
        const containerWidth = document.querySelector('.book-container').clientWidth;
        const unscaledViewport = page.getViewport({ scale: 1 }); // 원본 사이즈 기준 뷰포트
        const scale = containerWidth / unscaledViewport.width * 0.95; // 너비에 맞춘 스케일
        const viewport = page.getViewport({ scale }); // 스케일을 반영한 뷰포트 생성

        // 캔버스 크기를 PDF 페이지 크기에 맞게 설정
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // 넘김 애니메이션 효과 처리
        if (direction === 'next') {
            canvas.style.transform = 'translateX(100%)'; // 오른쪽에서 들어오게 설정
            setTimeout(() => {
                canvas.style.transition = 'transform 0.6s ease'; // 부드러운 전환 설정
                canvas.style.transform = 'translateX(0)'; // 원래 위치로 이동
            }, 10); // 약간의 시간 지연 후 실행
        } else if (direction === 'prev') {
            canvas.style.transform = 'translateX(-100%)'; // 왼쪽에서 들어오게 설정
            setTimeout(() => {
                canvas.style.transition = 'transform 0.6s ease';
                canvas.style.transform = 'translateX(0)';
            }, 10);
        }

        // 페이지 내용을 캔버스에 렌더링
        page.render({ canvasContext: ctx, viewport: viewport });

        // 페이지 번호 텍스트 업데이트 (예: 3 / 10)
        document.getElementById('page-info').textContent = `${num} / ${totalPages}`;
    });
}

// ← 이전 버튼 클릭 시 동작
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage <= 1) return; // 첫 페이지라면 무시
    currentPage--; // 현재 페이지 번호 감소
    renderPage(currentPage, 'prev'); // 이전 방향 애니메이션과 함께 렌더링
});

// → 다음 버튼 클릭 시 동작
document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage >= totalPages) return; // 마지막 페이지라면 무시
    currentPage++; // 현재 페이지 번호 증가
    renderPage(currentPage, 'next'); // 다음 방향 애니메이션과 함께 렌더링
});

// 창 크기 변경 시 현재 페이지를 다시 렌더링하여 반응형 대응
window.addEventListener('resize', () => {
    renderPage(currentPage); // 현재 페이지를 다시 그림
});

// PDF 문서를 비동기로 불러오고, 첫 페이지 렌더링
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf; // 전역 변수에 PDF 문서 저장
    totalPages = pdf.numPages; // 전체 페이지 수 저장
    renderPage(currentPage); // 첫 페이지 렌더링
});

// // 닫기(×) 버튼 클릭 시 뷰어 영역 숨기기
// document.getElementById('closeBtn').addEventListener('click', () => {
//     document.getElementById('bookViewer').style.display = 'none'; // 뷰어 영역 안 보이게 설정
// });
