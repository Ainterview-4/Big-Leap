import { Router } from "express";
import { authGuard } from "../middlewares/authGuard";
import {
    createInterview,
    startSession,
    listMyInterviews,
    getInterviewById,
    answerInterview,
    evaluateInterview,
    getSessionById,
} from "../controllers/interview.controller";

const router = Router();

// POST /api/interviews -> interview oluştur
router.post("/", authGuard, createInterview);

// GET /api/interviews -> interview listesi
router.get("/", authGuard, listMyInterviews);

// GET /api/interviews/:interviewId -> interview detayları
router.get("/:interviewId", authGuard, getInterviewById);

// POST /api/interviews/:interviewId/sessions -> session başlat
router.post("/:interviewId/sessions", authGuard, startSession);

router.post("/sessions/:sessionId/answer", authGuard, answerInterview);
router.post("/sessions/:sessionId/evaluate", authGuard, evaluateInterview);
router.get("/sessions/:sessionId", authGuard, getSessionById);



export default router;
