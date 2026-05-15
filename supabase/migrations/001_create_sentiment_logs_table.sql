-- 001_create_sentiment_logs_table.sql
-- 이 파일은 감성 분석 결과를 저장하기 위한 테이블을 생성합니다.

-- sentiment_logs 테이블 생성
-- uuid를 기본키로 사용하며, 사용자 입력 텍스트, 감정 결과, 신뢰도, 분석 이유, 생성일자를 저장합니다.
CREATE TABLE IF NOT EXISTS sentiment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 고유 식별자 (자동 생성)
  input_text TEXT NOT NULL,                      -- 사용자가 입력한 원본 텍스트
  sentiment VARCHAR(20) NOT NULL,                -- 분석된 감정 (긍정, 부정, 중립 등)
  confidence INTEGER NOT NULL,                   -- 분석 결과의 신뢰도 (0~100)
  reason TEXT NOT NULL,                          -- AI가 해당 감정으로 분석한 이유
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 데이터 생성 시각 (기본값 현재 시각)
);

-- 인덱스 추가 (조회 성능 최적화)
-- 생성일자 기준으로 정렬하여 조회하는 경우가 많으므로 인덱스를 생성합니다.
CREATE INDEX IF NOT EXISTS idx_sentiment_logs_created_at ON sentiment_logs (created_at DESC);
