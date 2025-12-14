import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email ve şifre gerekli" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Bu email ile zaten kayıt olunmuş" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).json({
            message: "Kayıt başarılı",
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Kayıt sırasında bir hata oluştu" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Geçersiz email veya şifre" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Geçersiz email veya şifre" });
            return;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Giriş sırasında bir hata oluştu" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;
    // Password reset logic would go here (sending email etc.)
    console.log(`Password Reset Request for: ${email}`);
    res.json({ message: "Şifre sıfırlama bağlantısı gönderildi" });
});

export default router;
