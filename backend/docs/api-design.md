# API Design – Interview AI Platform (MVP)

Bu doküman Interview AI Platform'un backend API tasarımını tanımlar.  
Swagger/OpenAPI üretimi bu doküman temel alınarak yapılacaktır.

---

# 1. Genel Bilgiler

**Base URL (local)**  
[text](http://localhost:5000/api)


**Auth yöntemi**  
JWT Bearer Token  

Authorization: Bearer <token>

**Content-Type**  

application/json


**Standart Response Formatı**

Başarılı:
```json
{
  "success": true,
  "data": {...},
  "error": null
}


Hatalı:

{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": {}
  }
}

2. Endpoint Grupları

-Auth

-User

-CV Optimization

-Interview

-System / Debug


3. AUTH ENDPOINTS
3.1 POST /auth/register

Yeni kullanıcı oluşturur.

Request

{
  "email": "user@example.com",
  "password": "Password123!",
  "full_name": "John Doe"
}


Response 201

{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "error": null
}


3.2 POST /auth/login

JWT token üretir.

Request
{
  "email": "user@example.com",
  "password": "Password123!"
}




Response 200
{
  "success": true,
  "data": {
    "access_token": "jwt-token",
    "expires_in": 3600
  },
  "error": null
}


3.3 POST /auth/forgot-password
Şifre sıfırlama isteği oluşturur.
Request
{
  "email": "user@example.com"
}

Response 200
{
  "success": true,
  "data": {
    "message": "If this email exists, a reset link was sent."
  },
  "error": null
}


3.4 POST /auth/reset-password
Token ile şifre yeniler.
Request
{
  "reset_token": "token-from-email",
  "new_password": "NewPassword123!"
}

Response 200
{
  "success": true,
  "data": {
    "message": "Password successfully reset."
  },
  "error": null
}


4. USER ENDPOINTS
4.1 GET /user/profile
JWT zorunlu.
Response
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://...",
    "bio": "Software Engineer",
    "linkedin": "https://linkedin.com/in/...",
    "github": "https://github.com/..."
  },
  "error": null
}


4.2 PATCH /user/profile
Kullanıcı profili günceller.
Request
{
  "full_name": "John Doe Updated",
  "avatar_url": "https://...",
  "bio": "Updated bio",
  "linkedin": "https://...",
  "github": "https://..."
}

Response
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "full_name": "John Doe Updated",
    "avatar_url": "https://...",
    "bio": "Updated bio",
    "linkedin": "https://...",
    "github": "https://..."
  },
  "error": null
}


5. CV OPTIMIZATION ENDPOINT
5.1 POST /cv/optimize
Request
{
  "cv_text": "Full CV text...",
  "job_description": "Backend Intern job description..."
}

Response
{
  "success": true,
  "data": {
    "optimized_cv": "Optimized CV text...",
    "missing_keywords": ["REST API", "TypeScript", "Node.js"],
    "suggestions": [
      "Add more measurable achievements.",
      "Highlight TypeScript projects."
    ]
  },
  "error": null
}


6. INTERVIEW ENDPOINTS
6.1 POST /interview/start
Yeni mülakat oturumu başlatır.
Request
{
  "cv_text": "Full CV text...",
  "position": "Backend Intern"
}

Response
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "first_question": "Tell me about yourself."
  },
  "error": null
}


6.2 POST /interview/answer
Cevaba göre follow-up veya yeni soru üretir.
Request
{
  "session_id": "uuid",
  "answer": "My experience includes..."
}

Response
{
  "success": true,
  "data": {
    "next_question": "Can you give a concrete example?",
    "is_followup": true,
    "is_last": false
  },
  "error": null
}


6.3 POST /interview/evaluate
Tüm cevaplara göre değerlendirme yapar.
Request
{
  "session_id": "uuid"
}

Response
{
  "success": true,
  "data": {
    "score": 78,
    "strengths": ["Communication", "Algorithms"],
    "weaknesses": ["Project explanation clarity"],
    "recommendations": [
      "Practice STAR method.",
      "Prepare detailed examples."
    ]
  },
  "error": null
}


6.4 GET /interview/{session_id}
Önceki mülakat özeti.
Response
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "position": "Backend Intern",
    "status": "completed",
    "started_at": "2025-11-28T12:00:00Z",
    "ended_at": "2025-11-28T12:30:00Z",
    "questions_count": 8
  },
  "error": null
}


7. SYSTEM / DEBUG ENDPOINTS
7.1 GET /system/health
Servis durumunu döner.
Response
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime_sec": 12093
  },
  "error": null
}


7.2 POST /system/rag-debug-query
RAG motorunu test eder.
Request
{
  "query": "python threading questions"
}

Response
{
  "success": true,
  "data": {
    "retrieved_count": 5,
    "results": [
      {"text": "Explain threading in Python...", "distance": 0.23}
    ]
  },
  "error": null
}

