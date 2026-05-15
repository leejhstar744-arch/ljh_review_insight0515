# Database Schema

## Table: sentiment_logs

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary Key |
| input_text | text | 사용자 입력 |
| sentiment | varchar | 감성 결과 |
| confidence | integer | 신뢰도 |
| reason | text | 분석 이유 |
| created_at | timestamp | 생성일 |

## SQL
```sql
create table sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment varchar(20) not null,
  confidence integer not null,
  reason text not null,
  created_at timestamp default now()
);
```
