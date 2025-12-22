import { Router } from "express";
import multer from "multer";
import { authGuard } from "../../middlewares/authGuard";
import { uploadCv, listMyCvs, getCvById, optimizeCvHandler } from "./cv.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/upload", authGuard, upload.single("file"), uploadCv);
router.get("/", authGuard, listMyCvs);
router.post("/optimize", authGuard, optimizeCvHandler); // ✅ New endpoint
router.get("/:cvId", authGuard, getCvById);

export default router;
