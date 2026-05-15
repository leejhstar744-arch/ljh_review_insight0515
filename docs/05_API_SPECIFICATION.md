# API Specification

## POST /api/analyze

### Request
```json
{
  "text": "오늘 정말 행복한 하루였어!"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "sentiment": "긍정",
    "confidence": 95,
    "reason": "긍정적인 감정 표현이 강하게 나타납니다."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "텍스트를 입력해주세요."
}
```
