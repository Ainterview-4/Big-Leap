import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db";
import { ok, fail } from "../utils/response";
import jwt from "jsonwebtoken";


const router = Router();

/**
 * POST /api/auth/register
 * body: { email, password, full_name }
 * name gelirse full_name yerine kabul ediyoruz (fallback)
 */
router.post("/register", async (req, res) => {
    try {
        // Neden trim + lowerCase?
        // Aynı email "Test@x.com" / "test@x.com" diye iki kez kayıt olmasın diye normalize ediyoruz.
        const email = String(req.body?.email ?? "").trim().toLowerCase();

        // Neden stringe çeviriyoruz?
        // undefined / number gibi saçma tipler gelirse patlamasın, kontrollü doğrulayalım.
        const password = String(req.body?.password ?? "");

        // Neden name fallback?
        // Frontend bazen full_name yerine name gönderebilir, kırılmasın diye mapliyoruz.
        const full_name = String(req.body?.full_name ?? req.body?.name ?? "").trim();

        // Neden validation?
        // DB’ye boş/eksik veri yazmak hem bug hem güvenlik açığı.
        if (!email || !password || !full_name) {
            return fail(
                res,
                "VALIDATION_ERROR",
                "email, password, full_name are required (name accepted as fallback)",
                null,
                400
            );
        }

        // Neden önce kontrol?
        // Email unique olmalı; yoksa DB error alırsın, biz daha temiz 409 döndürüyoruz.
        const exists = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
        if (exists.rowCount && exists.rowCount > 0) {
            return fail(res, "EMAIL_EXISTS", "Email already registered", null, 409);
        }

        // Neden bcrypt hash?
        // Şifre DB’ye asla düz yazı kaydedilmez. Hash + salt güvenlik standardı.
        const password_hash = await bcrypt.hash(password, 10);

        // Neden RETURNING?
        // Insert sonrası user’ı geri alıp response’a koymak için (tekrar SELECT yapmayalım).
        const created = await pool.query(
            `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, created_at`,
            [email, password_hash, full_name]
        );

        // Neden ok/fail wrapper?
        // Frontend her response’u aynı formatta okusun: success/data/error.
        return ok(res, { user: created.rows[0] }, 201);
    } catch (err: any) {
        console.error("POST /api/auth/register error:", err);
        return fail(res, "SERVER_ERROR", "Unexpected error", err?.message ?? null, 500);
    }
});
/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body?.email ?? "").trim().toLowerCase();
        const password = String(req.body?.password ?? "");

        // Neden validation?
        // Eksik veriyle DB sorgusu atmak anlamsız ve güvenlik açığı.
        if (!email || !password) {
            return fail(res, "VALIDATION_ERROR", "email and password are required", null, 400);
        }

        // Neden DB'den çekiyoruz?
        // User gerçekten var mı kontrolü
        const userRes = await pool.query(
            "SELECT id, email, full_name, password_hash FROM users WHERE email = $1 LIMIT 1",
            [email]
        );

        if (!userRes.rowCount) {
            return fail(res, "INVALID_CREDENTIALS", "Email or password incorrect", null, 401);
        }

        const user = userRes.rows[0];

        // Neden bcrypt.compare?
        // Plain password ile hash'i güvenli şekilde karşılaştırır
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return fail(res, "INVALID_CREDENTIALS", "Email or password incorrect", null, 401);
        }

        // Neden JWT?
        // Login sonrası kimlik doğrulama için stateless token
        if (!process.env.JWT_SECRET) {
            return fail(res, "CONFIG_ERROR", "JWT_SECRET not set", null, 500);
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return ok(res, {
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            },
        });
    } catch (err: any) {
        console.error("POST /api/auth/login error:", err);
        return fail(res, "SERVER_ERROR", "Unexpected error", err?.message ?? null, 500);
    }
});


export default router;
