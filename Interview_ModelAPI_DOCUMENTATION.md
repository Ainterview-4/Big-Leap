# Interactive Interview Bot API

**Base URL**: `https://167.172.172.136.sslip.io`
**Version**: v1

## 1. Authentication
All API requests must include the API key in the HTTP headers.

*   **Header**: `X-API-Key`
*   **Value**: `dBkh-1C2vGDM1Drpj5I58uJIxBoMIALuEbPmLAqMg5M`

### CORS
The API supports Cross-Origin Resource Sharing (CORS) for all origins (`*`). It can be consumed directly from web frontends.

---

## 2. Interview Workflow
The interview process is stateful, identified by a client-generated `session_id`. The entire conversational loop is handled by the `/next-turn` endpoint.

### **POST** `/v1/next-turn`
Process a turn in the interview: start a session, submit an answer, and retrieve the next question.

#### A. Start New Session
To begin, send the session configuration.
```json
{
  "session_id": "uuid-v4-string",
  "role": "Software Engineer",
  "difficulty": "Medium",
  "company": "Amazon",
  "tags": ["redis"],
  "mode": "new"
}
```

#### B. Submit Answer & Continue
To submit an answer, include the `previous_` fields. The response will contain grading for the previous answer and the new question text.
```json
{
  "session_id": "uuid-v4-string",
  "role": "Software Engineer",
  "difficulty": "Medium",
  "company": "Amazon",
  "tags": ["redis"],
  "mode": "new",
  "previous_question_id": "prev-question-uuid",
  "previous_question": "Question text...",
  "previous_answer": "Candidate answer..."
}
```

#### Response Structure
```json
{
  "id": "question-uuid",
  "question_text": "Next question text...",
  "last_grade": {
    "score": 4,
    "short_feedback": "Good answer, but...",
    "should_ask_followup": false
  },
  "category": "Technical_Knowledge",
  "role": "Software Engineer",
  "company": "Amazon",
  "difficulty": "Medium"
}
```

#### Parameters Reference
*   **`mode`**: Always send `"new"` for standard flow. The system automatically switches to follow-up questions if the AI grader deems it necessary.
*   **`tags`**: Optional list of technologies (e.g., `["python", "aws"]`). Leave empty `[]` if not applicable.
*   **`previous_question_id`**: Required when submitting an answer.

---

## 3. Session Management

### **POST** `/v1/finalize-session`
Ends the session and calculates summary statistics.

**Request**:
```json
{ "session_id": "uuid-v4-string" }
```

**Response**:
```json
{
  "session_id": "uuid-v4-string",
  "total_answers": 7,
  "average_score": 4.2
}
```

---

## 4. Metadata Reference
Use these values to populate frontend dropdowns.

### Roles
*   Software Engineer
*   Product Manager
*   Software Engineer Intern
*   Data Scientist
*   Network Engineer
*   QA Engineer
*   Data Analyst
*   Frontend Developer
*   Embedded Software Engineer
*   Machine Learning Engineer
*   Full Stack Developer
*   iOS Developer
*   Data Engineer
*   DevOps Engineer
*   Backend Developer
*   Scrum Master
*   AI Engineer
*   Software Architect
*   Android Developer
*   UI Engineer
*   Mobile Developer
*   Cloud Engineer
*   CyberSecurity Engineer
*   IT Manager
*   Game Developer

### Difficulties
*   Easy
*   Medium
*   Hard

### Companies
*   Google
*   Amazon
*   Meta
*   Microsoft
*   IBM
*   Cisco
*   Apple
*   Oracle
*   SAP
*   Nvidia
*   Adobe
*   Tesla
*   AMD
*   Netflix
*   Caterpillar
*   American Express
*   Intel
*   OpenAI
