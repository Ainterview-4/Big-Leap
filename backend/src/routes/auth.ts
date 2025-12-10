import express from "express";

const router = express.Router();

// In-memory mock database
const users: any[] = [];

router.post("/register", (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email ve şifre gerekli" });
        return
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        res.status(400).json({ message: "Bu email ile zaten kayıt olunmuş" });
        return
    }

    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);

    console.log("Mock Register:", newUser);
    res.status(201).json({ message: "Kayıt başarılı", user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
        res.status(401).json({ message: "Geçersiz email veya şifre" });
        return
    }

    res.json({ token: "mock-jwt-token-" + user.id, user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/reset-password", (req, res) => {
    const { email } = req.body;
    const user = users.find((u) => u.email === email);

    // Security best practice: Don't reveal if user exists or not, but for mock debugging we log it.
    console.log(`Mock Password Reset Request for: ${email}. User exists: ${!!user}`);

    // Always return success
    res.json({ message: "Şifre sıfırlama bağlantısı gönderildi (Mock)" });
});

export default router;
