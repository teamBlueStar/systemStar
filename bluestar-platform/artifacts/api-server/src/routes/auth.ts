import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const authRouter = Router();

// POST /api/auth/login
authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email y contraseña requeridos" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.active) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  req.session.userId = user.id;
  req.session.userEmail = user.email;
  req.session.userName = user.name;
  req.session.userRole = user.role;
  req.session.userClientId = user.clientId ?? null;

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId ?? null,
    },
  });
});

// POST /api/auth/logout
authRouter.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Error al cerrar sesión" });
      return;
    }
    res.clearCookie("bluestar.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me
authRouter.get("/auth/me", (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }
  res.json({
    user: {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      role: req.session.userRole,
      clientId: req.session.userClientId ?? null,
    },
  });
});

export default authRouter;
