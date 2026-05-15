/**
 * script.js
 * AI Sentiment Analyzer 프론트엔드 로직
 * 
 * 주요 기능:
 * 1. 버튼 클릭 이벤트 처리
 * 2. 백엔드 API 호출 (fetch 사용)
 * 3. 로딩 상태 표시 및 결과 모달 제어
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 필요한 DOM 요소 참조
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const spinner = analyzeBtn.querySelector('.spinner');
    
    const resultModal = document.getElementById('result-modal');
    const sentimentResult = document.getElementById('sentiment-result');
    const confidenceValue = document.getElementById('confidence-value');
    const analysisReason = document.getElementById('analysis-reason');
    const closeModalBtns = document.querySelectorAll('.close-btn, #modal-close-btn');

    // API 서버 주소 (로컬 환경 기준)
    const API_URL = 'http://localhost:3000/api/analyze';

    /**
     * 감성 분석 요청 함수
     */
    const analyzeSentiment = async () => {
        const text = textInput.value.trim();

        // 빈 텍스트 검사
        if (!text) {
            alert('분석할 텍스트를 입력해 주세요.');
            return;
        }

        // 로딩 상태 시작 (버튼 비활성화, 스피너 표시)
        setLoading(true);

        try {
            // 백엔드 API 호출
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            const result = await response.json();

            if (result.success) {
                // 성공 시 결과 모달 표시
                showResult(result.data);
            } else {
                // 서버 에러 메시지 표시
                alert(result.message || '분석 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            alert('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해 주세요.');
        } finally {
            // 로딩 상태 종료
            setLoading(false);
        }
    };

    /**
     * 로딩 상태 UI 제어 함수
     */
    function setLoading(isLoading) {
        analyzeBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    /**
     * 결과 모달을 띄우는 함수
     */
    function showResult(data) {
        sentimentResult.textContent = data.sentiment;
        confidenceValue.textContent = data.confidence;
        analysisReason.textContent = data.reason;

        // 감정에 따른 색상/아이콘 처리 (옵션)
        if (data.sentiment === '부정') {
            sentimentResult.style.color = '#ff3b30'; // Apple Red
        } else if (data.sentiment === '긍정') {
            sentimentResult.style.color = '#34c759'; // Apple Green
        } else {
            sentimentResult.style.color = '#007aff'; // Apple Blue
        }

        resultModal.classList.remove('hidden');
    }

    /**
     * 모달 닫기 함수
     */
    const closeModal = () => {
        resultModal.classList.add('hidden');
    };

    // 2. 이벤트 리스너 등록
    analyzeBtn.addEventListener('click', analyzeSentiment);

    // 모달 닫기 버튼들 (X 버튼, 확인 버튼)
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // 배경(오버레이) 클릭 시에도 모달 닫기
    resultModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // 단축키: Ctrl + Enter 누르면 분석 실행
    textInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            analyzeSentiment();
        }
    });
});
