/**
 * server.js
 * AI Sentiment Analyzer 백엔드 서버 메인 파일
 * 
 * 주요 기능:
 * 1. Express 서버 설정
 * 2. OpenAI API 연동을 통한 감성 분석
 * 3. Supabase 연동을 통한 분석 결과 저장
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 설정 (.env 파일 로드)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 교차 출처 리소스 공유 허용
app.use(express.json()); // JSON 형식의 요청 바디 파싱

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * POST /api/analyze
 * 텍스트를 받아 AI로 감성 분석을 수행하고 결과를 DB에 저장합니다.
 */
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  // 1. 유효성 검사
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: '분석할 텍스트를 입력해주세요.'
    });
  }

  try {
    // 2. OpenAI API를 이용한 감성 분석 수행
    // 시스템 프롬프트를 통해 결과 형식을 JSON으로 고정합니다.
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 감성 분석 전문가입니다. 입력된 텍스트의 감성을 [긍정, 부정, 중립] 중 하나로 분류하고, 신뢰도(0-100)와 그 이유를 한국어로 답변하세요. 응답은 반드시 JSON 형식이어야 합니다. 예시: {"sentiment": "긍정", "confidence": 95, "reason": "..."}'
        },
        {
          role: 'user',
          content: text
        }
      ],
      response_format: { type: 'json_object' }
    });

    const analysisResult = JSON.parse(completion.choices[0].message.content);

    // 3. 분석 결과를 Supabase DB에 저장
    const { data, error } = await supabase
      .from('sentiment_logs')
      .insert([
        {
          input_text: text,
          sentiment: analysisResult.sentiment,
          confidence: analysisResult.confidence,
          reason: analysisResult.reason
        }
      ]);

    if (error) {
      console.error('DB 저장 중 오류 발생:', error);
      // DB 저장에 실패하더라도 분석 결과는 클라이언트에 반환할 수 있습니다.
    }

    // 4. 성공 결과 반환
    res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('API 처리 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
